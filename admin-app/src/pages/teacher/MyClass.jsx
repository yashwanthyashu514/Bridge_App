import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'
import { Eye, Search, GraduationCap, Phone, User, ArrowLeft, LayoutGrid, CheckCircle2, XCircle, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MyClass() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/teacher/my-class')
        setStudents(data)
      } catch (err) {
        toast.error('Failed to load class students')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.regNumber?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Loading Class Directory...</p>
    </div>
  )

  return (
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700 text-slate-900">
      
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">My Class Directory</h1>
          <p className="text-slate-400 font-medium">Full list of students in your assigned class</p>
        </div>
        <div className="flex items-center gap-6">
          <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black">
            {students.length} students
          </span>
          <button 
            onClick={() => navigate('/teacher')}
            className="flex items-center gap-3 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <LayoutGrid className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12">
        <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name, roll number or phone..."
          className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-3xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(s => (
          <div key={s._id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100 group relative">
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100 transition-transform group-hover:scale-105">
                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <Link 
                to={`/teacher/student/${s._id}`}
                className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-black text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{s.name}</h3>
              <p className="text-xs font-bold text-slate-400 font-mono tracking-wider">{s.studentId}</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-[13px] font-bold text-slate-500">
                <GraduationCap className="w-4 h-4 text-slate-300" />
                <span>Class {s.class} · {s.regNumber || '123456'}</span>
              </div>
              <div className="flex items-center gap-3 text-[13px] font-bold text-slate-500">
                <Phone className="w-4 h-4 text-slate-300" />
                <span>{s.studentMobile || '7795817114'}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {s.status === 'absent' ? (
                  <>
                    <XCircle className="w-4 h-4 text-rose-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-500">Absent today</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500">Present today</span>
                  </>
                )}
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Attendance</p>
                <p className="text-lg font-black text-emerald-600">94%</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Score</p>
                <p className="text-lg font-black text-indigo-600">88%</p>
              </div>
            </div>

            <Link 
              to={`/teacher/student/${s._id}`}
              className="w-full py-5 bg-white border-2 border-slate-100 rounded-3xl text-slate-700 font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
            >
              View Performance Report
              <span className="text-lg">&rarr;</span>
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-slate-100 mt-12">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">No students found matching your search</p>
        </div>
      )}
    </div>
  )
}
