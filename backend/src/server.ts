import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { db } from "./config/db";
import auditRoutes from "./routes/audit.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import authRoutes from "./routes/auth.routes";
import societyRoutes from "./routes/society.routes";
import issueRoutes from "./routes/issue.routes";
import userRoutes from "./routes/user.routes";
import { protect } from "./middlewares/auth.middleware";

const app = express();
const PORT = process.env.BACKEND_PORT || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/society",protect, societyRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/issues", auditRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

// Test Protected Route
app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});
app.get("/api/test",(req,res)=>{
  res.json({
    message: "Backend is working"
  })
})

// Database Connection
db();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at Port:${PORT}`);
});