import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { useAuth } from '../../context/AuthContext'
import { Clock, User, CalendarDays, ArrowLeft } from 'lucide-react'

export default function StudentTimetable() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const PERIODS = [1,2,3,4,5,6,7,8]

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/management/timetable?class=${user.class}`)
        setTimetable(data)
      } catch (err) {
        console.error('Failed to load timetable', err)
      } finally { setLoading(false) }
    }
    load()
  }, [user.class])

  const getSlot = (day, period) => {
    const dayData = timetable.find(t => t.day === day)
    return dayData?.slots.find(s => s.period === String(period))
  }

  // Helper to get time for a period (from first day that has it)
  const getPeriodTime = (period) => {
    for (const day of timetable) {
      const slot = day.slots.find(s => s.period === String(period))
      if (slot?.startTime) return { start: slot.startTime, end: slot.endTime }
    }
    return null
  }

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Retrieving Class Schedule...</p>
    </div>
  )

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-3 text-indigo-500 font-bold text-[10px] uppercase tracking-widest mb-4">
             <CalendarDays className="w-4 h-4" />
             <span>Academic Schedule</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Class {user.class} Timetable</h1>
          <p className="text-slate-500 font-medium">Your weekly academic schedule as assigned by the management.</p>
        </div>
        <button 
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <span>Back to Dashboard</span>
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left border-r border-slate-100 sticky left-0 bg-slate-50 z-20">Day / Period</th>
                {PERIODS.map(p => {
                  const time = getPeriodTime(p)
                  return (
                    <th key={p} className="px-8 py-10 text-center min-w-[180px] border-r border-slate-50 last:border-r-0">
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period {p}</span>
                        {time && (
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-indigo-500 bg-indigo-50/50 px-3 py-1.5 rounded-full self-center">
                            <Clock className="w-3 h-3" />
                            <span>{time.start} - {time.end}</span>
                          </div>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map(day => (
                <tr key={day} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-10 font-black text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.02)]">{day}</td>
                  {PERIODS.map(period => {
                    const slot = getSlot(day, period)
                    return (
                      <td key={period} className="px-4 py-4">
                        {slot ? (
                          <div className="bg-white border border-indigo-100 rounded-3xl p-6 shadow-sm group-hover:shadow-md transition-all border-l-[6px] border-l-indigo-500">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2">{slot.teacherId?.subject || 'General'}</p>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center">
                                <User className="w-4 h-4 text-slate-400" />
                              </div>
                              <p className="text-sm font-bold text-slate-700 leading-tight">{slot.teacherId?.name || 'Assigned'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-24 border-2 border-dashed border-slate-100 rounded-[32px] flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Class</span>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-2xl font-black mb-3 tracking-tight">Academic Hours</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">Please adhere strictly to the period timings shown above. Punctuality is essential for a smooth learning experience.</p>
        </div>
      </div>
    </div>
  )
}
