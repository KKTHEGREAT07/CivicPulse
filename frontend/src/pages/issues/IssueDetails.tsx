import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import type { Issue } from "../../types/issue"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import TimelineItem from "../../components/ui/TimeLineItem"
import type { Membership } from "../../types/user"

interface AuditLog {
  _id: string
  action: string
  performedBy?: {
    name: string
  }
  oldValue?: string
  newValue?: string
  createdAt: string
}

function IssueDetails() {

  const { id } = useParams()

  const [issue, setIssue] = useState<Issue | null>(null)
  const [members, setMembers] = useState<Membership[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [assignmember, setassignMembers] = useState<string | null>(null)

  useEffect(() => {

    const fetchData = async () => {

      try {

        const issueRes = await API.get(`/issues/${id}`)
        setIssue(issueRes.data)

        const assignedto = issueRes.data.assignedTo ?? null
        setassignMembers(assignedto)

        const memberRes = await API.get("/users?role=member")
        setMembers(memberRes.data)

        const logRes = await API.get(`/issues/${id}/logs`)
        setLogs(logRes.data)

      } catch (err: any) {

        setError(err.response?.data?.message || "Failed to load issue")

      } finally {
        setLoading(false)
      }

    }

    fetchData()

  }, [id])


  const updateStatus = async (status: string) => {

    try {

      const res = await API.patch(`/issues/${id}`, { status })

      setIssue(res.data)

    } catch (err) {
      console.error(err)
    }

  }


  const assignIssue = async (memberId: string) => {

    try {

      const res = await API.patch(`/issues/${id}/assign`, {
        memberId
      })

      setIssue(res.data)

    } catch (err) {
      console.error(err)
    }

  }


  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading issue...</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    )
  }

  if (!issue) return null


  return (

    <DashboardLayout>

      <Card>

        {/* TITLE */}
        <h1 className="text-2xl font-bold mb-2">
          {issue.title}
        </h1>

        {/* BADGES */}
        <div className="flex gap-2 mb-4">
          <Badge text={issue.severity} variant={issue.severity} />
          <Badge text={issue.status} variant={issue.status} />
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-600 mb-6">
          {issue.description}
        </p>

        {/* IMAGE */}
        {issue.imageUrl && (
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Attachment</h3>
            <img
              src={issue.imageUrl}
              alt="Issue attachment"
              className="max-w-full h-auto rounded-xl shadow-sm border border-gray-200 max-h-96 object-contain"
            />
          </div>
        )}

        {/* STATUS CONTROLS */}
        <div className="mb-8">

          <h3 className="font-semibold mb-2">
            Update Status
          </h3>

          <div className="flex gap-3">

            <button
              onClick={() => updateStatus("open")}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Open
            </button>

            <button
              onClick={() => updateStatus("in-progress")}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              In Progress
            </button>

            <button
              onClick={() => updateStatus("resolved")}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Resolved
            </button>

          </div>

        </div>

        {/* ASSIGN MEMBER */}
        <div className="mb-10">

          <h3 className="font-semibold mb-2">
            Assign Member
          </h3>

          <select
            className="border p-2 rounded w-60"
            onChange={(e) => setassignMembers(e.target.value)}
          >

            <option value="">Select member</option>

            {members.map((member) => {
              return (
                <option key={member.userId._id} value={member.userId._id}>
                  {member.userId.name}
                </option>
              )
            })}

          </select>

          <button
            onClick={() => assignmember && assignIssue(assignmember)}
            disabled={!assignmember}
            className="ml-3 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Assign
          </button>

        </div>

        {/* AUDIT TIMELINE */}

        <div>

          <h3 className="text-lg font-semibold mb-6">
            Activity Timeline
          </h3>

          <div className="relative border-l border-gray-300 pl-6 space-y-6">

            {logs.map((log) => (
              <TimelineItem
                key={log._id}
                action={log.action}
                performedBy={log.performedBy?.name}
                oldValue={log.oldValue}
                newValue={log.newValue}
                createdAt={log.createdAt}
              />
            ))}

          </div>

        </div>

      </Card>

    </DashboardLayout>

  )

}

export default IssueDetails