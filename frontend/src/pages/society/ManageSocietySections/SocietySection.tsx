import { useState, useEffect } from "react"
import API from "../../../services/api"
import type { Society } from "../../../types/society"

type EditableField = keyof Society

function SocietySection() {
  const [society, setSociety] = useState<Society | null>(null)
  const [editing, setEditing] = useState<EditableField | null>(null)
  const [value, setValue] = useState("")

  useEffect(() => {
    API.get("/society/current").then(res => setSociety(res.data))
  }, [])

  const startEdit = (field: EditableField, current: any) => {
    setEditing(field)
    setValue(current !== undefined && current !== null ? String(current) : "")
  }


  const saveEdit = async () => {
    if (!editing || !society) return

    const updatedValue =
      editing === "totalFlats" ? Number(value) : value

    await API.patch("/society/update", { [editing]: updatedValue })

    setSociety(prev =>
      prev ? { ...prev, [editing]: updatedValue } : prev
    )

    setEditing(null)
  }


  type FieldProps = {
    label: string
    field: EditableField
  }

  const Field = ({ label, field }: FieldProps) => (
    <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700">
      <div className="text-slate-800 dark:text-slate-200">
        <strong className="text-slate-500 dark:text-slate-400 mr-2">{label}:</strong>{" "}
        {editing === field ? (
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            className="border border-slate-300 dark:border-slate-600 bg-transparent rounded outline-none focus:border-sky-500 px-2 py-1"
          />
        ) : (
          society?.[field] ?? "-"
        )}
      </div>

      {editing === field ? (
        <button className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors" onClick={saveEdit}>Save</button>
      ) : (
        <button className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors" onClick={() =>
          startEdit(field, society?.[field])
        }>
          Edit
        </button>
      )}
    </div>
  )

  if (!society) return <p className="text-slate-500 dark:text-slate-400">Loading...</p>

  return (
    <div className="space-y-4">
      <Field label="Name" field="name" />
      <Field label="Address" field="address" />
      <Field label="City" field="city" />
      <Field label="State" field="state" />
      <Field label="Flats" field="totalFlats" />

      {/* Danger Zone */}
      <div className="mt-8 p-6 border border-red-200 dark:border-red-900/50 rounded-xl bg-red-50 dark:bg-red-500/10">
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-red-600/20"
          onClick={async () => {
            if (!confirm("Delete society?")) return
            await API.delete("/society")
          }}
        >
          Delete Society
        </button>
      </div>
    </div>
  )
}

export default SocietySection