import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import type { Issue } from "../../types/issue"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import SLATimer from "../../components/SLATimer"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import { Plus, ChevronRight, Users } from "lucide-react"

function ManageIssues() {
  const [issues,setIssues] = useState<Issue[]>([])
  const [loading,setLoading] = useState(true)
  const navigate=useNavigate()
  const user = useSelector((state:RootState)=>state.auth.user)

  useEffect(()=>{
    const fetchIssues = async () => {
      try{
        const res = await API.get("/issues")
        setIssues(res.data)
      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }
    fetchIssues()
  },[])

  const open = issues.filter(i => i.status === "open")
  const progress = issues.filter(i => i.status === "in-progress")
  const resolved = issues.filter(i => i.status === "resolved")

  if(loading){
    return (
      <DashboardLayout>
        <p className="text-slate-500 dark:text-slate-400">Loading board...</p>
      </DashboardLayout>
    )
  }

  const toggleReport = async (issueid:string) =>{
    try {
        const response=await API.patch(`/issues/${issueid}/report`)
        const updatedIssue=response.data
        setIssues((prevIssues)=>prevIssues.map((issue)=>(issue._id===updatedIssue._id?updatedIssue:issue)))
    } catch (error) {
        console.error(error)
    }
  }

  const Column = ({title, data}: {title: string, data: Issue[]}) => (
    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-slate-700 dark:text-slate-200 tracking-tight">
          {title}
        </h2>
        <span className="bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200 dark:border-slate-600">
          {data.length}
        </span>
      </div>

      {data.length === 0 && (
        <div className="text-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 text-sm font-medium">
          No issues in this column
        </div>
      )}

      <div className="space-y-4">
        {data.map(issue=>{
            const voted = issue.reporters.includes(user?.id || "");
            return (
            <Card key={issue._id} className="p-5 hover:shadow-md border-transparent hover:border-slate-300 dark:hover:border-slate-600">
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        <Badge text={issue.severity} variant={issue.severity}/>
                    </div>
                    <SLATimer createdAt={issue.createdAt} priority={issue.severity} />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700">
                        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <Users size={14} className="text-slate-400 dark:text-slate-500" />
                          {issue.reportCount}
                        </div>
                        <button
                          onClick={() => toggleReport(issue._id)}
                          className={`flex items-center justify-center w-7 h-7 rounded text-lg font-bold transition-all shadow-sm ${
                              voted 
                              ? "bg-sky-500 text-white shadow-sky-500/20" 
                              : "bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600"
                          }`}
                        >
                          {voted ? "−" : "+"}
                        </button>
                    </div>

                    {user?.role === "admin" && (
                        <button onClick={()=>navigate(`/issues/${issue._id}`)} className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-0.5">
                            Details <ChevronRight size={14} />
                        </button>
                    )}
                  </div>
                </div>
            </Card>
            )
        })}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              Issue Board
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track the progress of community issues.</p>
        </div>
        <button
            onClick={()=>{navigate("/report-issue")}}
            className="flex items-center gap-2 bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-700 transition-colors shadow-sm shadow-sky-600/20"
        >
            <Plus size={18} />
            Report Issue
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-5">
        <Column title="Open" data={open}/>
        <Column title="In Progress" data={progress}/>
        <Column title="Resolved" data={resolved}/>
      </div>
    </DashboardLayout>
  )
}

export default ManageIssues