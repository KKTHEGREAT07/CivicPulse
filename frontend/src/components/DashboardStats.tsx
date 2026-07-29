import { useEffect, useState } from "react"
import API from "../services/api"
import Card from "./ui/Card"
import { LayoutList, FolderOpen, Loader, CheckCircle2 } from "lucide-react"

interface Stats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

function DashboardStats() {
  const [stats,setStats] = useState<Stats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(()=>{
    const fetchStats = async () => {
      try {
        const res = await API.get("/issues")
        const issues = Array.isArray(res.data) ? res.data : []
        const counts = issues.reduce((acc, issue) => {
          acc.total++
          if (issue.status === "open") acc.open++
          if (issue.status === "in-progress") acc.inProgress++
          if (issue.status === "resolved") acc.resolved++
          return acc
        }, { total: 0, open: 0, inProgress: 0, resolved: 0 })
        setStats(counts)
      } catch (err) {
        console.error("Fetch Stats Error:", err)
      }
    }
    fetchStats()
  },[])

  const statCards = [
    { title: "Total Issues", value: stats.total, icon: LayoutList, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { title: "Open Issues", value: stats.open, icon: FolderOpen, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/10" },
    { title: "In Progress", value: stats.inProgress, icon: Loader, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { title: "Resolved Issues", value: stats.resolved, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, i) => (
        <Card key={i} className="flex items-center gap-5 group hover:-translate-y-1">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${stat.bg} ${stat.color}`}>
            <stat.icon size={26} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              {stat.title}
            </p>
            <p className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {stat.value}
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default DashboardStats