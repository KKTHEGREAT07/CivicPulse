import { useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import { useNavigate } from "react-router-dom"

function ReportIssue() {

  const [title,setTitle] = useState("")
  const [category,setCategory] = useState("plumbing")
  const [description,setDescription] = useState("")
  const [severity,setSeverity] = useState("low")
  const [imageBase64, setImageBase64] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate=useNavigate()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await API.post("/issues",{
        title,
        description,
        category,
        severity,
        image: imageBase64
      })

      alert("Issue created")
      navigate("/manageissues")
    } catch (err) {
      console.error(err)
      alert("Failed to create issue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <DashboardLayout>
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-0 text-slate-800 dark:text-white tracking-tight">
            Report Issue
        </h1>
        <button
            onClick={()=>{navigate("/manageissues")}}
            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
            Issue Board
        </button>
      </div>

      <div className="w-full bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700 my-6">

        <form onSubmit={handleSubmit}>

          <input
            className="w-full border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 p-3 mb-5 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-400 placeholder:text-slate-400"
            placeholder="Issue Title"
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            className="w-full border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 p-3 mb-5 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-400 placeholder:text-slate-400 h-32 resize-y"
            placeholder="Description"
            onChange={(e)=>setDescription(e.target.value)}
          />

          <select
            className="w-full border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 p-3 mb-5 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-400 appearance-none"
            onChange={(e)=>setCategory(e.target.value)}
          >
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="plumbing">Plumbing</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="electricity">Electricity</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="lift">Lift</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="security">Security</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="cleanliness">Cleanliness</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="water">Water</option>
          </select>

          <select
            className="w-full border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 p-3 mb-5 rounded-xl outline-none focus:border-sky-500 dark:focus:border-sky-400 appearance-none"
            onChange={(e)=>setSeverity(e.target.value)}
          >
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="low">Low</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="medium">Medium</option>
            <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="high">High</option>
          </select>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Attach Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-slate-300 dark:border-slate-600 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 dark:file:bg-sky-900/30 dark:file:text-sky-400 dark:hover:file:bg-sky-900/50 transition-all cursor-pointer"
              onChange={handleImageChange}
            />
            {imageBase64 && (
              <img src={imageBase64} alt="Preview" className="mt-4 h-40 object-cover rounded-xl shadow-sm border border-slate-200 dark:border-slate-700" />
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 disabled:opacity-70 transition-colors font-semibold shadow-sm shadow-sky-600/20 mt-2"
          >
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </button>

        </form>

      </div>

    </DashboardLayout>

  )
}

export default ReportIssue