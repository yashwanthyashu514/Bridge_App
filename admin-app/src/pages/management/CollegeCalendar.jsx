import { useEffect, useState } from 'react'
import api from '../../api'
import { Calendar as CalendarIcon, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import toast from 'react-hot-toast'

export default function CollegeCalendar() {
  const [events, setEvents] = useState([])
  const [currMonth, setCurrMonth] = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', date: format(new Date(), 'yyyy-MM-dd'), type: 'holiday', color: '#ef4444' })

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const { data } = await api.get('/management/calendar')
      setEvents(data)
    } catch { toast.error('Failed to load events') }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await api.post('/management/calendar', form)
      toast.success('Event added!')
      setShowModal(false)
      load()
    } catch { toast.error('Failed to add event') }
  }

  const handleDel = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await api.delete(`/management/calendar/${id}`)
      toast.success('Event deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  const days = eachDayOfInterval({
    start: startOfMonth(currMonth),
    end: endOfMonth(currMonth)
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">College Calendar</h1>
          <p className="text-gray-500 mt-1">Manage holidays, exams, and institutional events</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-700">{format(currMonth, 'MMMM yyyy')}</h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrMonth(subMonths(currMonth, 1))} className="btn-secondary p-2"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setCurrMonth(new Date())} className="btn-secondary text-xs uppercase font-bold tracking-widest">Today</button>
            <button onClick={() => setCurrMonth(addMonths(currMonth, 1))} className="btn-secondary p-2"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="bg-gray-50 py-3 text-center text-[10px] font-black uppercase text-gray-400 tracking-tighter">{d}</div>
          ))}
          {/* Pad start of month */}
          {Array.from({ length: startOfMonth(currMonth).getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="bg-white min-h-[100px] opacity-20"></div>
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const dayEvents = events.filter(e => e.date === dateStr)
            return (
              <div key={dateStr} className={`bg-white min-h-[100px] p-2 hover:bg-primary-50 transition-colors ${isToday(day) ? 'ring-2 ring-primary-500 ring-inset z-10' : ''}`}>
                <span className={`text-sm font-bold ${isToday(day) ? 'text-primary-600' : 'text-gray-400'}`}>{format(day, 'd')}</span>
                <div className="mt-1 space-y-1">
                  {dayEvents.map(e => (
                    <div key={e._id} className="text-[10px] px-1.5 py-0.5 rounded border border-black/5 font-bold truncate flex items-center justify-between group" style={{ backgroundColor: `${e.color}20`, color: e.color }}>
                      <span>{e.title}</span>
                      <button onClick={() => handleDel(e._id)} className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800"><Trash2 className="w-2.5 h-2.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Add Calendar Event</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label">Event Title</label>
                <input type="text" className="input" placeholder="e.g. Mid-Term Exams" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="holiday">Holiday</option>
                    <option value="exam">Examination</option>
                    <option value="event">Function/Event</option>
                  </select>
                </div>
                <div>
                  <label className="label">Color Tag</label>
                  <input type="color" className="input h-10 p-1" value={form.color} onChange={e => setForm({...form, color: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
