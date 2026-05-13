import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { Users, GraduationCap, Clock, Trophy, Plus, Megaphone } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <p className="text-4xl font-black text-slate-800 tracking-tight tabular-nums">{value}</p>
      <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mt-1">{label}</p>
    </div>
  </div>
)

const InsightCard = ({ title, desc, icon: Icon, to, color }) => (
  <Link to={to} className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col gap-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:rotate-6 transition-transform`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  </Link>
)

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ teachers: 0, students: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [tRes, sRes, pRes] = await Promise.all([
          api.get('/admin/teachers'),
          api.get('/admin/students?status=approved'),
          api.get('/auth/pending-students')
        ])
        setStats({
          teachers: tRes.data.length,
          students: sRes.data.length,
          pending: pRes.data.length
        })
      } catch { toast.error('Failed to load dashboard') }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-xs uppercase">Initializing Dashboard...</p>
    </div>
  )

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/30">
      <div className="p-8 lg:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-700">
        
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Welcome back, <span className="text-indigo-600 italic font-serif">Principal</span></h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/admin/create')} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                <Plus className="w-4 h-4" /> Create Staff
             </button>
             <button onClick={() => navigate('/admin/announcement')} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm">
                <Megaphone className="w-4 h-4" /> Send Announcement
             </button>
          </div>
        </header>

        {/* Top Stats - Hero Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label="Total Teachers" value={stats.teachers} icon={Users} color="bg-indigo-50 text-indigo-600" />
          <StatCard label="Total Students" value={stats.students} icon={GraduationCap} color="bg-emerald-50 text-emerald-600" />
          <button 
            onClick={() => navigate('/admin/students?filter=pending')}
            className="text-left group transition-transform hover:scale-[1.02] active:scale-95"
          >
            <StatCard 
              label="Pending Approvals" 
              value={stats.pending} 
              icon={Clock} 
              color="bg-amber-50 text-amber-600" 
            />
          </button>
        </div>


      {/* Directories & Insights */}
      <div className="mb-8">
        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] mb-10">Directories & Insights</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InsightCard 
            title="Teachers Directory" 
            desc="Browse and manage all teaching staff, assignments, and subjects." 
            icon={Users} 
            to="/admin/teachers" 
            color="bg-indigo-50 text-indigo-600"
          />
          <InsightCard 
            title="Student Directory" 
            desc="View enrolled students, attendance records, and academic status." 
            icon={GraduationCap} 
            to="/admin/students" 
            color="bg-emerald-50 text-emerald-600"
          />
          <InsightCard 
            title="Leaderboard" 
            desc="Top performers across all classes based on academic excellence." 
            icon={Trophy} 
            to="/admin/leaderboard" 
            color="bg-amber-50 text-amber-600"
          />
        </div>
      </div>
    </div>
  </div>
  )
}


