interface Props {
  text: string
  variant?: "low" | "medium" | "high" | "open" | "in-progress" | "resolved"
}

function Badge({ text, variant }: Props) {
  const getColor = () => {
    switch(variant) {
      case "high": return "bg-rose-100 text-rose-700 border-rose-200"
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200"
      case "low": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "resolved": return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "in-progress": return "bg-blue-100 text-blue-700 border-blue-200"
      case "open": return "bg-slate-100 text-slate-700 border-slate-200"
      default: return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <span className={`text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getColor()}`}>
      {text}
    </span>
  )
}

export default Badge