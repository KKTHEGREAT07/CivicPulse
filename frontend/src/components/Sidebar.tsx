import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"
import { LayoutDashboard, AlertCircle, Building2 } from "lucide-react"

function Sidebar() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="w-72 bg-slate-900 border-r border-slate-800 text-slate-300 min-h-screen p-6 flex flex-col shadow-xl z-20 relative">
      <div className="flex items-center gap-3 mb-12 text-white">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-500/30">
          C
        </div>
        <h2 className="text-2xl font-bold tracking-tight">CivicPulse</h2>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-sky-500/10 text-sky-400 font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-sky-500/20"
                : "hover:bg-slate-800 hover:text-white border border-transparent"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <LayoutDashboard size={20} className={isActive ? "text-sky-400" : "text-slate-400"}/>
              Dashboard
            </>
          )}
        </NavLink>

        <NavLink
          to="/manageissues"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-sky-500/10 text-sky-400 font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-sky-500/20"
                : "hover:bg-slate-800 hover:text-white border border-transparent"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <AlertCircle size={20} className={isActive ? "text-sky-400" : "text-slate-400"}/>
              Issue Board
            </>
          )}
        </NavLink>

        {user?.role === "admin" && (
          <NavLink
            to="/managesociety"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-sky-500/10 text-sky-400 font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-sky-500/20"
                  : "hover:bg-slate-800 hover:text-white border border-transparent"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Building2 size={20} className={isActive ? "text-sky-400" : "text-slate-400"}/>
                Manage Society
              </>
            )}
          </NavLink>
        )}      
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400 font-bold uppercase shadow-inner">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role || 'Role'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar