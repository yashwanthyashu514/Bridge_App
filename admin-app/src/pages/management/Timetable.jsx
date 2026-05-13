import { useEffect, useState } from 'react'
import api from '../../api'
import { Save, User, Clock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Timetable() {
  const [cls, setCls] = useState('11')
  const [timetable, setTimetable] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Manage period times locally (common for all days)
  const [periodTimings, setPeriodTimings] = useState(
    Array.from({ length: 8 }, (_, i) => ({
      period: String(i + 1),
      startTime: '09:00',
      endTime: '09:45'
    }))
  )

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]

  useEffect(() => {
    load()
  }, [cls])

  const load = async () => {
    setLoading(true)
    try {
      const [ttRes, tRes] = await Promise.all([
        api.get(`/management/timetable?class=${cls}`),
        api.get('/admin/teachers')
      ])
      
      const ttData = ttRes.data
      setTimetable(ttData)
      setTeachers(tRes.data)

      // Sync period timings from existing data if available
      if (ttData.length > 0 && ttData[0].slots.length > 0) {
        const newTimings = [...periodTimings]
        ttData[0].slots.forEach(slot => {
          const idx = PERIODS.indexOf(Number(slot.period))
          if (idx !== -1) {
            newTimings[idx] = { 
              period: slot.period, 
              startTime: slot.startTime || '09:00', 
              endTime: slot.endTime || '09:45' 
            }
          }
        })
        setPeriodTimings(newTimings)
      }
    } finally { setLoading(false) }
  }

  const getSlot = (day, period) => {
    const dayData = timetable.find(t => t.day === day)
    return dayData?.slots.find(s => s.period === String(period))
  }

  const handleSlotChange = (day, period, teacherId) => {
    setTimetable(prev => {
      const updated = [...prev]
      let dayData = updated.find(t => t.day === day)
      
      if (!dayData) {
        dayData = { day, class: cls, slots: [] }
        updated.push(dayData)
      }

      dayData.slots = dayData.slots.filter(s => s.period !== String(period))
      if (teacherId) {
        dayData.slots.push({ period: String(period), teacherId: teachers.find(t => t._id === teacherId) })
      }
      return updated
    })
  }

  const handleTimeChange = (periodIdx, field, value) => {
    const newTimings = [...periodTimings]
    newTimings[periodIdx][field] = value
    setPeriodTimings(newTimings)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Prepare save data for each day
      const savePromises = DAYS.map(day => {
        const dayData = timetable.find(t => t.day === day) || { day, slots: [] }
        
        // Attach current timings to slots
        const finalSlots = dayData.slots.map(slot => {
          const timing = periodTimings[PERIODS.indexOf(Number(slot.period))]
          return {
            ...slot,
            startTime: timing.startTime,
            endTime: timing.endTime,
            teacherId: slot.teacherId?._id || slot.teacherId // Handle both populated and ID
          }
        })

        // Also add empty slots with timings if we want consistency, 
        // but typically we only save assigned slots.
        // For this app, we'll just save assigned slots with their assigned timings.

        return api.put('/management/timetable', { 
          class: cls, 
          day, 
          slots: finalSlots 
        })
      })

      await Promise.all(savePromises)
      toast.success('Timetable saved successfully!')
      load()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save timetable')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Loading Schedule...</p>
    </div>
  )

  return (
    <div className="p-8 md:p-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Timetable Management</h1>
          <p className="text-slate-500 font-medium">Configure teacher assignments and period timings for Class {cls}.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
             {['11','12'].map(c => (
               <button 
                 key={c} 
                 onClick={() => setCls(c)} 
                 className={`px-6 py-2 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${cls === c ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Class {c}
               </button>
             ))}
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all disabled:opacity-50"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left border-r border-slate-100 sticky left-0 bg-slate-50 z-20">
                  Day / Period
                </th>
                {PERIODS.map((p, idx) => (
                  <th key={p} className="px-6 py-8 min-w-[200px] border-r border-slate-100 last:border-r-0">
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Period {p}</span>
                      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <input 
                          type="time" 
                          value={periodTimings[idx].startTime}
                          onChange={(e) => handleTimeChange(idx, 'startTime', e.target.value)}
                          className="text-[10px] font-bold text-slate-600 focus:outline-none bg-transparent"
                        />
                        <span className="text-[10px] text-slate-300">-</span>
                        <input 
                          type="time" 
                          value={periodTimings[idx].endTime}
                          onChange={(e) => handleTimeChange(idx, 'endTime', e.target.value)}
                          className="text-[10px] font-bold text-slate-600 focus:outline-none bg-transparent"
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {DAYS.map(day => (
                <tr key={day} className="group hover:bg-slate-50/30 transition-all">
                  <td className="px-8 py-10 font-black text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-100 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.02)]">
                    {day}
                  </td>
                  {PERIODS.map(period => {
                    const slot = getSlot(day, period)
                    return (
                      <td key={period} className="px-4 py-4 border-r border-slate-50 last:border-r-0">
                        <div className="relative">
                          <select 
                            className={`w-full text-xs font-bold p-4 rounded-2xl border-2 transition-all appearance-none cursor-pointer focus:outline-none ${slot ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'}`}
                            value={slot?.teacherId?._id || slot?.teacherId || ''}
                            onChange={(e) => handleSlotChange(day, period, e.target.value)}
                          >
                            <option value="">— Unassigned —</option>
                            {teachers.map(t => (
                              <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>
                            ))}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                            {slot ? <CheckCircle className="w-4 h-4 text-indigo-600" /> : <User className="w-4 h-4" />}
                          </div>
                        </div>
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
         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Clock className="w-6 h-6" /></div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Message</p>
               <p className="text-sm font-bold text-slate-600">Ensure all periods have assigned times before saving for students to see correctly.</p>
            </div>
         </div>
      </div>
    </div>
  )
}
