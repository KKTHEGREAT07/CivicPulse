import { useEffect, useState } from "react"
import { Clock, AlertTriangle } from "lucide-react"

interface Props {
  createdAt: string
  priority: "low" | "medium" | "high"
}

function SLATimer({ createdAt, priority }: Props) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  const getSLAHours = () => {
    if (priority === "high") return 12
    if (priority === "medium") return 24
    return 48
  }

  useEffect(() => {
    const updateTimer = () => {
      const created = new Date(createdAt).getTime()
      const slaHours = getSLAHours() * 60 * 60 * 1000
      const deadline = created + slaHours
      const remaining = deadline - Date.now()
      setTimeLeft(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000)
    return () => clearInterval(interval)
  }, [createdAt, priority])

  if (timeLeft <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded-md text-xs font-semibold">
        <AlertTriangle size={14} />
        <span>SLA Breached</span>
      </div>
    )
  }

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const isUrgent = hours < 2

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold ${isUrgent ? 'text-orange-600 bg-orange-50' : 'text-slate-500 bg-slate-50'}`}>
      <Clock size={14} className={isUrgent ? 'animate-pulse' : ''} />
      <span>{hours}h {minutes}m left</span>
    </div>
  )
}

export default SLATimer