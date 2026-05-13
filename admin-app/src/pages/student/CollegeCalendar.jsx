import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info, ArrowLeft } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'

export default function StudentCalendar() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [currMonth, setCurrMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const { data } = await api.get('/management/calendar')
      setEvents(data)
    } finally { setLoading(false) }
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currMonth),
    end: endOfMonth(currMonth)
  })

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Syncing Institutional Calendar...</p>
    </div>
  )

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-3 text-indigo-500 font-bold text-[10px] uppercase tracking-widest mb-4">
             <CalendarIcon className="w-4 h-4" />
             <span>Campus Events</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">College Calendar</h1>
          <p className="text-slate-500 font-medium">Keep track of holidays, examinations, and important campus events.</p>
        </div>
        <button 
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <span>Back to Dashboard</span>
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{format(currMonth, 'MMMM yyyy')}</h2>
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
            <button onClick={() => setCurrMonth(subMonths(currMonth, 1))} className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-indigo-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setCurrMonth(new Date())} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-colors">
              Today
            </button>
            <button onClick={() => setCurrMonth(addMonths(currMonth, 1))} className="p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-indigo-600">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">{d}</div>
          ))}
          
          {/* Pad start of month */}
          {Array.from({ length: startOfMonth(currMonth).getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="bg-slate-50/30 rounded-3xl min-h-[140px]"></div>
          ))}

          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const dayEvents = events.filter(e => e.date === dateStr)
            const today = isToday(day)

            return (
              <div 
                key={dateStr} 
                className={`min-h-[140px] p-4 rounded-3xl transition-all border ${
                  today 
                    ? 'bg-indigo-50/30 border-indigo-200 ring-2 ring-indigo-500/10' 
                    : 'bg-white border-slate-50 hover:bg-slate-50/50 hover:border-slate-100'
                }`}
              >
                <span className={`text-lg font-black ${today ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {format(day, 'd')}
                </span>
                <div className="mt-3 space-y-2">
                  {dayEvents.map(e => (
                    <div 
                      key={e._id} 
                      className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-sm border border-black/5 flex flex-col gap-0.5" 
                      style={{ backgroundColor: `${e.color}15`, color: e.color }}
                    >
                      <span className="opacity-50 text-[8px]">{e.type}</span>
                      <span className="truncate">{e.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-12 flex items-center gap-10 p-10 bg-slate-900 rounded-[40px] text-white">
         <div className="flex-1">
            <h3 className="text-2xl font-black mb-2">Important Notice</h3>
            <p className="text-slate-400 text-sm leading-relaxed">The calendar is subject to change based on university guidelines. Please check back regularly for updates regarding examination schedules.</p>
         </div>
         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <Info className="w-8 h-8 text-indigo-400" />
         </div>
      </div>
    </div>
  )
}
