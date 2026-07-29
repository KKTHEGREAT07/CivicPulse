import { useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../../features/auth/authSlice"
import { Building2, ArrowRight } from "lucide-react"

function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSignup = async (e:React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res=await API.post("/auth/signup",{ name, email, password })
      const user = res.data.user
      dispatch(setUser(user))
      navigate("/join-society")
    } catch (err:any) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-600/20 to-blue-900/40 z-0"></div>
        <div className="absolute top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/10 blur-[100px]"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Building2 size={40} className="text-sky-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Join the smart society revolution.</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Create an account to report issues, join your community, and start living better today.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 text-slate-800 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-sky-500/30">
              C
            </div>
            <h2 className="text-2xl font-bold tracking-tight">CivicPulse</h2>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Create an account</h1>
          <p className="text-slate-500 mb-8">Sign up in seconds to get started.</p>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-3 rounded-lg text-sm font-medium border border-rose-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white shadow-sm"
                placeholder="John Doe"
                onChange={(e)=>setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white shadow-sm"
                placeholder="you@example.com"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white shadow-sm"
                placeholder="••••••••"
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 text-white font-medium py-3 rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? "Creating account..." : (
                <>Sign up <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500">
            Already have an account?{" "}
            <button onClick={()=>navigate("/login")} className="text-slate-900 font-semibold hover:text-slate-700 transition-colors">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup