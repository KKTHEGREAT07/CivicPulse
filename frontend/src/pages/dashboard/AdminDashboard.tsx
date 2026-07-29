import DashboardLayout from "../../layouts/DashboardLayout"
import DashboardStats from "../../components/DashboardStats"
import API from "../../services/api"
import { useEffect, useState } from "react"
import { Hash } from "lucide-react"

function AdminDashboard(){
  const [societyCode,setsocietyCode] = useState<string>("")
  
  useEffect(()=>{
    const fetchsociety=async ()=>{
      try {
        const res=await API.get("/society/current")
        setsocietyCode(res.data.code)
      } catch (error) {
        console.error(error)
      }
    }
    fetchsociety()
  },[])

  return(
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of all community activities and issue resolutions.</p>
        </div>

        {societyCode && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Hash size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Society Code</p>
              <p className="font-bold text-slate-800 dark:text-white tracking-widest">{societyCode}</p>
            </div>
          </div>
        )}
      </div>
      
      <DashboardStats/>

      {/* Placeholder for future sections */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 p-8 shadow-sm text-center mt-6">
        <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-2">Detailed Analytics Coming Soon</h3>
        <p className="text-slate-500 dark:text-slate-400">We are currently gathering data to generate comprehensive reports.</p>
      </div>
    </DashboardLayout>
  )
}

export default AdminDashboard