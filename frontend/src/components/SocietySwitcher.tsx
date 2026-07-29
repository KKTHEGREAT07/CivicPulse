import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import API from "../services/api"
import type { RootState } from "../app/store"
import { setUser } from "../features/auth/authSlice"
import { Building, Plus, LogIn, ChevronDown } from "lucide-react"

function SocietySwitcher() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const memberships = user?.memberships || []
  const [triedFetchingNames,setTriedFetchingNames] = useState(false)

  useEffect(() => {
    const hasMissingSocietyNames = memberships.some((membership) => {
      return typeof membership.societyId === "string" || !membership.societyId.name
    })

    if (!hasMissingSocietyNames || triedFetchingNames) return

    API.get("/auth/me")
      .then((res) => {
        dispatch(setUser(res.data.user))
      })
      .finally(() => setTriedFetchingNames(true))
  }, [dispatch, memberships, triedFetchingNames])

  const getSocietyId = (societyId: typeof memberships[number]["societyId"]) => {
    return typeof societyId === "string" ? societyId : societyId._id
  }

  const getSocietyLabel = (societyId: typeof memberships[number]["societyId"]) => {
    if (typeof societyId !== "string") {
      return societyId.name || "Unnamed society"
    }

    return triedFetchingNames ? "Society name unavailable" : "Loading society..."
  }

  const handleChange = async (societyId: string) => {
    if (!societyId || societyId === user?.currentSocietyId) return

    await API.post("/society/current", { societyId })
    const res = await API.get("/auth/me")

    dispatch(setUser(res.data.user))
  }

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
          <Building size={24} />
        </div>
        <div className="relative group">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Current Society</p>
          <div className="relative">
            <select
              value={user?.currentSocietyId || ""}
              onChange={(e) => handleChange(e.target.value)}
              className="appearance-none bg-transparent border-none text-slate-800 dark:text-white font-semibold text-lg p-0 pr-8 focus:ring-0 cursor-pointer outline-none min-w-[200px]"
            >
              {memberships.length === 0 && (
                <option value="" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">No society joined</option>
              )}

              {memberships.map((membership) => (
                <option key={getSocietyId(membership.societyId)} value={getSocietyId(membership.societyId)} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
                  {getSocietyLabel(membership.societyId)} ({membership.role})
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors" />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          to="/join-society"
          className="flex items-center gap-2 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-500 transition-all shadow-sm"
        >
          <LogIn size={18} />
          Join Society
        </Link>

        <Link
          to="/create-society"
          className="flex items-center gap-2 bg-slate-900 dark:bg-sky-600 text-white font-medium px-4 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-sky-500 transition-all shadow-sm shadow-slate-900/20 dark:shadow-sky-600/20"
        >
          <Plus size={18} />
          Create Society
        </Link>
      </div>
    </div>
  )
}

export default SocietySwitcher