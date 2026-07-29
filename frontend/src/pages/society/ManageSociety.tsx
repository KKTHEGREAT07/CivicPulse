import { useState } from "react"
import DashboardLayout from "../../layouts/DashboardLayout"
import ResidentsSection from "./ManageSocietySections/ResidentsSection"
import SocietySection from "./ManageSocietySections/SocietySection"

function ManageSociety(){

  const [section, setSection] = useState<"society" | "residents">("society")

  return(

    <DashboardLayout>

      <div className="flex gap-6 mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">
        <button
          className={section === "society" ? "font-bold border-b-2 border-slate-800 dark:border-white text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"}
          onClick={() => setSection("society")}
        >
          Society
        </button>

        <button
          className={section === "residents" ? "font-bold border-b-2 border-slate-800 dark:border-white text-slate-800 dark:text-white" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"}
          onClick={() => setSection("residents")}
        >
          Residents
        </button>
      </div>

      {section === "society" && <SocietySection />}
      {section === "residents" && <ResidentsSection />}

    </DashboardLayout>

  )

}

export default ManageSociety
