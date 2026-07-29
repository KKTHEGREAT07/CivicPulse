import { Request, Response } from "express";
import { Issue } from "../models/issue.model";
import { Society } from "../models/society.model";
import { calculatePriority } from "../utils/priority";
import { AuditLog } from "../models/audit.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: 'u8mpbd6w',
  api_key: '132795837433923',
  api_secret: 'TaEl6azGXeEfD_hLJmMNuMSrQYU'
});

// Create Issue (Resident)
export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, category, severity, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = req.user;

    const society = await Society.findById(user.society);

    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const existingIssue = await Issue.findOne({
      society: user.society,
      category,
      title: { $regex: `^${title}$`, $options: "i" },
      status: { $ne: "resolved" }
    });

    if (existingIssue) {

      const alreadyReported = existingIssue.reporters.some(
        (id) => id.toString() === user.id
      );

      if (alreadyReported) {
        return res.status(200).json({
          message: `You have already reported this issue. ${existingIssue.reportCount} people have reported it.`,
          issue: existingIssue
        });
      }

      existingIssue.reporters.push(
        new mongoose.Types.ObjectId(user.id)
      );

      existingIssue.reportCount += 1;

      const isBreached =
        existingIssue.status !== "resolved" &&
        new Date() > existingIssue.slaDeadline;

      existingIssue.priorityScore = calculatePriority({
        category: existingIssue.category,
        reportCount: existingIssue.reportCount,
        isBreached
      });

      await existingIssue.save();

      return res.status(200).json({
        message: `${existingIssue.reportCount} people have reported this issue.`,
        issue: existingIssue
      });
    }

    const slaHours = society.defaultSLAs[category as keyof typeof society.defaultSLAs] || 24;

    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const isBreached = false;

    const priorityScore = calculatePriority({
      category,
      reportCount: 1,
      isBreached
    });

    let imageUrl = undefined;
    if (image) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: "civicpulse_issues",
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
      }
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      priorityScore,
      reporters: [user.id],
      reportedBy: user.id,
      society: user.society,
      slaDeadline,
      imageUrl
    });

    res.status(201).json(issue);

  } catch (error) {
    console.error("CREATE ISSUE ERROR:", error);
    res.status(500).json({ message: "Failed to create issue" });
  }
};


export const getSocietyIssues = async (req: Request, res: Response) => {
  try {
    const { society } = req.user!;

    const overdueIssues = await Issue.find({
      society,
      status: { $ne: "resolved" },
      isEscalated: false,
      slaDeadline: { $lt: new Date() }
    });

    for (const issue of overdueIssues) {
      issue.isEscalated = true;
      issue.breachedAt = new Date();

      issue.priorityScore = calculatePriority({
        category: issue.category,
        reportCount: issue.reportCount,
        isBreached: true
      });

      await AuditLog.create({
        issue: issue._id,
        action: "escalation",
        performedBy: issue.assignedBy || issue.reportedBy,
        oldValue: "SLA Active",
        newValue: "SLA Breached"
      });

      await issue.save();
    }

    let filter: any = { society };

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .sort({ priorityScore: -1 });

    res.json(issues);

  } catch (error) {
    console.error("GET ISSUES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};


// Update Issue Status (Member/Admin)
export const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;


    const issue = await Issue.findById(req.params.id);


    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const oldStatus = issue.status;

    await AuditLog.create({
      issue: issue._id,
      action: "status_change",
      performedBy: req.user!.id,
      oldValue: oldStatus,
      newValue: status
    });
    issue.status = status;
    await issue.save();

    res.json(issue);

  } catch (error) {
    res.status(500).json({ message: "Failed to update issue" });
  }
};

export const assignIssue = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member user not found" });
    }

    const oldAssignedId = issue.assignedTo;
    const oldMember = await User.findById(oldAssignedId);

    issue.assignedTo = new mongoose.Types.ObjectId(memberId);
    issue.assignedAt = new Date();
    issue.assignedBy = new mongoose.Types.ObjectId(req.user!.id);

    await issue.save();

    await AuditLog.create({
      issue: issue._id,
      action: "assignment",
      performedBy: req.user!.id,
      oldValue: oldMember.name,
      newValue: member.name
    });

    res.json({ message: "Issue assigned successfully", issue });

  } catch (error) {
    console.error("ASSIGN ISSUE ERROR:", error);
    res.status(500).json({ message: "Assignment failed" });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const { role, id, society } = req.user!;
    const issueId = req.params.id;

    const issue = await Issue.findById(issueId)
      .populate("reportedBy", "name flatNumber")
      .populate("assignedTo", "name role");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.society.toString() !== society) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (role === "resident") {
      const isReporter = issue.reporters.some(
        (r) => r.toString() === id
      );
      if (!isReporter) {
        return res.status(403).json({ message: "Not allowed to view this issue" });
      }
    }

    if (role === "member") {
   const b = issue.assignedTo.toString();
  const assignedId =
    typeof issue.assignedTo === "object"
      ? issue.assignedTo._id.toString()
      : b;

  if (assignedId !== id) {
    return res.status(403).json({ message: "Not assigned to this issue" });
  }

}

    // Format response for frontend
    const formattedIssue = {
      _id: issue._id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      severity: issue.severity,
      priority: issue.priorityScore,
      reportCount: issue.reportCount,
      slaDeadline: issue.slaDeadline,
      imageUrl: issue.imageUrl,
      createdAt: issue.createdAt
    };

    res.json(formattedIssue);

  } catch (error) {
    console.error("GET ISSUE BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch issue" });
  }
};

export const toggleReporter = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const issueId = req.params.id;

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    const hasReported = issue.reporters.some(rid => rid.toString() === userId);

    if (hasReported) {
      issue.reporters = issue.reporters.filter(rid => rid.toString() !== userId);
      issue.reportCount = Math.max(0, issue.reportCount - 1);
    } else {
      issue.reporters.push(userId as any);
      issue.reportCount += 1;
    }

    await issue.save();
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: "Toggle failed" });
  }
};