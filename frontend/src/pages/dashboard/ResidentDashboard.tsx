import { useEffect, useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import API from "../../services/api"
import type { Issue } from "../../types/issue"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import SLATimer from "../../components/SLATimer"
import { Link } from "react-router-dom"
import { AlertCircle, Users } from "lucide-react"

function ResidentDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await API.get("/issues")
        const allIssues: Issue[] = res.data
        const myIssues = allIssues.filter(i => i.reportedBy._id === user?.id)
        setIssues(myIssues)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyIssues()
  }, [user?.id])

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
          My Society Issues
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage issues reported by you.</p>
      </div>
      
      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading your issues...</p>
      ) : issues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-white">No issues reported</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">You haven't reported any issues yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map(issue => (
            <Link key={issue._id} to={`/issues/${issue._id}`} className="group outline-none block h-full">
              <Card className="h-full flex flex-col border-transparent hover:border-sky-200 hover:ring-4 hover:ring-sky-50 dark:hover:ring-sky-900/30 dark:bg-slate-800 dark:border-slate-700 transition-all cursor-pointer">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                    {issue.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {issue.description}
                  </p>
                </div>

                <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium bg-slate-50 dark:bg-slate-700/50 w-fit px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-600">
                    <Users size={14} className="text-slate-400 dark:text-slate-500" />
                    <span>Reported by <strong className="text-slate-700 dark:text-slate-300">{issue.reportCount}</strong> residents</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge text={issue.severity} variant={issue.severity}/>
                      <Badge text={issue.status} variant={issue.status}/>
                    </div>
                    <SLATimer createdAt={issue.createdAt} priority={issue.severity}/>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

export default ResidentDashboard