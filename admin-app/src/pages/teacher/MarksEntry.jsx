import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { Save, ClipboardList, Search, LayoutGrid, ChevronRight, Award, FileText, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function MarksEntry() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  
  const [examInfo, setExamInfo] = useState({
    examName: '',
    subject: '',
    maxMarks: 100
  })

  const [marks, setMarks] = useState({})

  useEffect(() => {
    if (user?.subject) {
      setExamInfo(prev => ({ ...prev, subject: user.subject }))
    }
    const load = async () => {
      try {
        const { data } = await api.get('/teacher/my-class')
        setStudents(data)
        const initial = {}
        data.forEach(s => initial[s._id] = '')
        setMarks(initial)
      } catch (err) {
        toast.error('Failed to load students')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const updateMark = (id, val) => {
    setMarks(prev => ({ ...prev, [id]: val }))
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    if (!examInfo.examName || !examInfo.subject) return toast.error('Please enter exam name and subject')
    
    setSaving(true)
    try {
      const entries = students.map(s => ({
        studentId: s._id,
        marks: Number(marks[s._id]) || 0,
        maxMarks: Number(examInfo.maxMarks)
      }))

      await api.post('/teacher/marks', {
        ...examInfo,
        entries
      })

      toast.success('Academic records updated successfully!')
      navigate('/teacher')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marks')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Opening Gradebook...</p>
    </div>
  )

  return (
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700 text-slate-900">
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2 italic text-blue-900">Academic Records</h1>
          <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
            <ClipboardList className="w-4 h-4" />
            <span className="text-slate-400">Record examination results for your class</span>
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

      {/* Exam Configuration Section */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-wrap gap-10 mb-12">
        <div className="flex-1 min-w-[250px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Exam Title *</label>
          <input 
            type="text" 
            placeholder="e.g. Mid-Term Assessment 2024" 
            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
            value={examInfo.examName} 
            onChange={e => setExamInfo(i => ({...i, examName: e.target.value}))} 
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Subject</label>
          <div className="px-6 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl font-black text-indigo-600 text-sm flex items-center gap-3">
            <Award className="w-4 h-4" />
            {examInfo.subject || 'Not Assigned'}
          </div>
        </div>
        <div className="w-[180px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Max Marks</label>
          <div className="relative">
            <input 
              type="number" 
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
              value={examInfo.maxMarks} 
              onChange={e => setExamInfo(i => ({...i, maxMarks: e.target.value}))} 
            />
          </div>
        </div>
      </div>

      {/* Marks Entry Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                {['Student Info', 'ID/Reg No', 'Marks Obtained', 'Percentage Status'].map(h => (
                  <th key={h} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => {
                const currentMark = Number(marks[s._id]) || 0;
                const percentage = (currentMark / Number(examInfo.maxMarks || 1)) * 100;
                
                return (
                  <tr key={s._id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-black text-slate-800 text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter uppercase">{s.studentId}</p>
                        <p className="text-[11px] font-black text-slate-800 bg-slate-50 w-fit px-2 py-0.5 rounded-md border border-slate-100">{s.regNumber || '123456'}</p>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          className="w-24 px-4 py-3 bg-white border border-slate-200 rounded-xl text-center font-black text-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all shadow-sm"
                          placeholder="0"
                          max={examInfo.maxMarks}
                          value={marks[s._id]}
                          onChange={e => updateMark(s._id, e.target.value)}
                        />
                        <span className="text-slate-300 font-bold text-sm">/ {examInfo.maxMarks}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-6">
                        <div className="flex-1 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                              percentage >= 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' :
                              percentage >= 40 ? 'bg-indigo-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-black w-10 text-right ${
                          percentage >= 80 ? 'text-emerald-600' :
                          percentage >= 40 ? 'text-slate-600' : 'text-rose-600'
                        }`}>
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {students.length === 0 && (
            <div className="py-24 text-center">
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">No students found for marks entry</p>
            </div>
          )}
        </div>
      </div>

      {/* Submission Bar */}
      <div className="mt-12 flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4 text-slate-400">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="text-xs font-bold uppercase tracking-wider">Ensure all grades are verified before final submission</p>
        </div>
        <button 
          onClick={handleSave} 
          className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl flex items-center gap-4 group"
          disabled={saving}
        >
          {saving ? 'Processing Records...' : 'Submit Final Marks'}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
