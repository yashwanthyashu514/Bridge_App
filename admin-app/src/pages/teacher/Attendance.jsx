import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { Check, X, Clock, Send, Users, ArrowLeft, LayoutGrid, AlertCircle, Save, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'

export default function Attendance() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  
  const [records, setRecords] = useState({})
  const [now, setNow] = useState(new Date())

  const [meta, setMeta] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    period: '1',
    session: 'AM',
    subject: ''
  })

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = new Date().getHours()
    const detectedSession = hour < 12 ? 'AM' : 'PM'
    setMeta(prev => ({
      ...prev,
      session: detectedSession,
      subject: user?.subject || ''
    }))
  }, [user])

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/teacher/my-class')
        setStudents(data)
        const initial = {}
        data.forEach(s => initial[s._id] = { status: 'present', remark: '' })
        setRecords(initial)
      } catch (err) {
        toast.error('Failed to load class students')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const updateStatus = (id, status) => {
    setRecords(prev => ({
      ...prev,
      [id]: { ...prev[id], status }
    }))
  }

  const updateRemark = (id, remark) => {
    setRecords(prev => ({
      ...prev,
      [id]: { ...prev[id], remark }
    }))
  }

  const handleSave = async () => {
    if (!meta.subject) return toast.error('Please enter subject name')
    setShowSummary(true)
  }

  const submitAttendance = async () => {
    setSaving(true)
    try {
      const formattedRecords = students.map(s => ({
        studentId: s._id,
        status: records[s._id].status,
        remark: records[s._id].remark
      }))

      const { data } = await api.post('/teacher/attendance', {
        ...meta,
        records: formattedRecords
      })

      toast.success(`Attendance saved! Notifications sent to ${data.absentCount} parents.`)
      setShowSummary(false)
      navigate('/teacher')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Accessing Daily Roll Call...</p>
    </div>
  )

  return (
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700 text-slate-900">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Mark Attendance</h1>
          <div className="flex items-center gap-3 text-indigo-600 font-bold text-sm">
            <Clock className="w-4 h-4" />
            <span>{format(now, 'hh:mm:ss a')}</span>
            <span className="text-slate-200">|</span>
            <span className="text-slate-400">Take daily attendance for your class</span>
          </div>
        </div>
        <button 
          onClick={() => navigate('/teacher')}
          className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <LayoutGrid className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Meta Information Cards */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-wrap gap-10 mb-12">
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Date</label>
          <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm">
            {format(new Date(), 'dd-MM-yyyy')}
          </div>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Period</label>
          <select 
            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all appearance-none cursor-pointer"
            value={meta.period} 
            onChange={e => setMeta(m => ({...m, period: e.target.value}))}
          >
            {[1,2,3,4,5,6,7,8].map(p => <option key={p} value={p}>Period {p}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Session</label>
          <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm">
            {meta.session}
          </div>
        </div>
        <div className="flex-[2] min-w-[200px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Subject</label>
          <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-black text-indigo-600 text-sm">
            {meta.subject || 'Maths'}
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['Student ID', 'Reg No', 'Name', 'Attendance Status', 'Remark (if leave)'].map(h => (
                  <th key={h} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s._id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-10 py-7 text-xs font-bold text-slate-400 font-mono tracking-tighter">{s.studentId}</td>
                  <td className="px-10 py-7 text-xs font-bold text-slate-500">{s.regNumber || '123456'}</td>
                  <td className="px-10 py-7 text-sm font-black text-slate-800">{s.name}</td>
                  <td className="px-10 py-7">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                      <button 
                        onClick={() => updateStatus(s._id, 'present')}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                          records[s._id]?.status === 'present' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:text-slate-800'
                        }`}>
                        Present
                      </button>
                      <button 
                        onClick={() => updateStatus(s._id, 'absent')}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                          records[s._id]?.status === 'absent' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-slate-500 hover:text-slate-800'
                        }`}>
                        Absent
                      </button>
                      <button 
                        onClick={() => updateStatus(s._id, 'leave')}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                          records[s._id]?.status === 'leave' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:text-slate-800'
                        }`}>
                        Leave
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" 
                      placeholder="Add reason..."
                      disabled={records[s._id]?.status !== 'leave'}
                      value={records[s._id]?.remark || ''}
                      onChange={e => updateRemark(s._id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-12 flex justify-end">
        <button 
          onClick={handleSave} 
          className="px-12 py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-4 group"
        >
          Review & Save Attendance
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Attendance Summary</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Review before submission</p>
              </div>
              <button onClick={() => setShowSummary(false)} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
              <div className="flex items-start gap-4 p-6 bg-rose-50 rounded-[32px] border border-rose-100">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">Absent Students (Parents will be notified)</p>
                  <div className="flex flex-wrap gap-2">
                    {students.filter(s => records[s._id].status === 'absent').length === 0 ? (
                      <p className="text-sm text-rose-700 font-bold italic">Perfect attendance today! No absences.</p>
                    ) : (
                      students.filter(s => records[s._id].status === 'absent').map(s => (
                        <span key={s._id} className="px-3 py-1.5 bg-white border border-rose-100 text-rose-700 rounded-lg text-xs font-bold">
                          {s.name}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-[32px] border border-amber-100">
                <Users className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Students on Approved Leave</p>
                  <div className="space-y-3">
                    {students.filter(s => records[s._id].status === 'leave').length === 0 ? (
                      <p className="text-sm text-amber-700 font-bold italic">No students on leave today.</p>
                    ) : (
                      students.filter(s => records[s._id].status === 'leave').map(s => (
                        <div key={s._id} className="text-xs text-amber-900 bg-white/50 p-3 rounded-xl border border-amber-100">
                          <strong className="block text-amber-700 mb-1">{s.name}</strong>
                          <span className="opacity-70">{records[s._id].remark || 'Reason not specified'}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 bg-slate-50/50 flex gap-4">
              <button onClick={() => setShowSummary(false)} className="flex-1 py-5 bg-white border border-slate-200 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                Go Back
              </button>
              <button 
                onClick={submitAttendance} 
                className="flex-1 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3" 
                disabled={saving}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Processing...' : 'Confirm & Notify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
