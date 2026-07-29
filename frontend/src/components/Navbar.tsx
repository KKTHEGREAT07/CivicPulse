import { useDispatch, useSelector } from "react-redux"
import { logoutUser } from "../features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import { LogOut, Bell, Moon, Sun } from "lucide-react"
import type { RootState } from "../app/store"
import { useEffect, useState } from "react"

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setIsDark(true)
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    }
  }

  const handleLogout = () => {
    API.post("/auth/logout")
    dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <div className="sticky top-0 z-30 flex justify-between items-center bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 px-8 py-5 transition-colors">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          Welcome back, {user?.name?.split(' ')[0] || 'User'} <span className="text-2xl">👋</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening in your community today.</p>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={toggleDarkMode} className="p-2.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-full transition-all">
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
        <button className="p-2.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-full transition-all relative">
          <Bell size={22} />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 transition-all px-4 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Navbar