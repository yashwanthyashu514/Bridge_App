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
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left border-r border-slate-100 sticky left-0 bg-slate-50 z-20">Day / Period</th>
                {PERIODS.map(p => (
                  <th key={p} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[160px]">
                    Period {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map(day => (
                <tr key={day} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-8 font-black text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.02)]">{day}</td>
                  {PERIODS.map(period => {
                    const slot = getSlot(day, period)
                    return (
                      <td key={period} className="px-4 py-4">
                        {slot ? (
                          <div className="bg-white border border-indigo-100 rounded-2xl p-4 shadow-sm group-hover:shadow-md transition-all border-l-4 border-l-indigo-500">
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{slot.teacherId?.subject || 'N/A'}</p>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-slate-400" />
                              <p className="text-sm font-bold text-slate-700">{slot.teacherId?.name || 'Assigned'}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-20 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center">
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Free Slot</span>
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
        <div className="bg-indigo-900 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-200">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2">Schedule Note</h3>
          <p className="text-indigo-200 text-sm leading-relaxed">Each period is strictly 45 minutes. Please be seated 5 minutes before the bell rings.</p>
        </div>
      </div>
    </div>
  )
}
