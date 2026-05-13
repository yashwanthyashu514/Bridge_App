import { useEffect, useState } from 'react'
import api from '../../api'
import { Table, Save, Plus, Trash2, Clock, User } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Timetable() {
  const [cls, setCls] = useState('11')
  const [timetable, setTimetable] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const PERIODS = [1,2,3,4,5,6,7,8]

  useEffect(() => {
    load()
  }, [cls])

  const load = async () => {
    try {
      const [ttRes, tRes] = await Promise.all([
        api.get(`/management/timetable?class=${cls}`),
        api.get('/admin/teachers')
      ])
      setTimetable(ttRes.data)
      setTeachers(tRes.data)
    } finally { setLoading(false) }
  }

  const getSlot = (day, period) => {
    const dayData = timetable.find(t => t.day === day)
    return dayData?.slots.find(s => s.period === String(period))
  }

  const handleUpdate = async (day, period, teacherId) => {
    const dayData = timetable.find(t => t.day === day) || { day, slots: [] }
    const updatedSlots = dayData.slots.filter(s => s.period !== String(period))
    if (teacherId) {
      updatedSlots.push({ period: String(period), teacherId })
    }

    try {
      await api.put('/management/timetable', { class: cls, day, slots: updatedSlots })
      load()
      toast.success('Timetable updated')
    } catch { toast.error('Failed to update') }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading timetable...</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
          <p className="text-gray-500 mt-1">Assign teachers to classes and time slots</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
           {['11','12'].map(c => (
             <button key={c} onClick={() => setCls(c)} className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${cls === c ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-400 hover:text-gray-600'}`}>Class {c}</button>
           ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-th bg-gray-100 sticky left-0 z-20 border-r border-gray-200">Day / Period</th>
                {PERIODS.map(p => (
                  <th key={p} className="table-th text-center min-w-[150px]">
                    <div className="flex flex-col">
                      <span className="text-xs">Period {p}</span>
                      <span className="text-[10px] font-normal text-gray-400">Slot {p}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DAYS.map(day => (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="table-td font-bold text-gray-600 bg-gray-50 sticky left-0 z-10 border-r border-gray-200">{day}</td>
                  {PERIODS.map(period => {
                    const slot = getSlot(day, period)
                    return (
                      <td key={period} className="table-td p-1">
                        <div className="relative group">
                          <select 
                            className={`w-full text-[11px] p-2 rounded-lg border-0 focus:ring-2 focus:ring-primary-500 appearance-none bg-transparent transition-all ${slot ? 'font-bold text-primary-700 bg-primary-50/50' : 'text-gray-300'}`}
                            value={slot?.teacherId?._id || ''}
                            onChange={(e) => handleUpdate(day, period, e.target.value)}
                          >
                            <option value="">— Assign —</option>
                            {teachers.map(t => (
                              <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>
                            ))}
                          </select>
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                            <User className="w-3 h-3" />
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
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card p-4 bg-indigo-50 border-indigo-100 flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Clock className="w-5 h-5" /></div>
            <div>
               <p className="text-xs font-bold text-indigo-800 uppercase">Standard Period</p>
               <p className="text-sm text-indigo-600">45 Minutes per slot</p>
            </div>
         </div>
      </div>
    </div>
  )
}
