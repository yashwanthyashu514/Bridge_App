import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { Users, GraduationCap, Clock, ChevronRight, Trophy } from 'lucide-react'

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
    <div className="p-10 lg:p-16 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="mb-14">
        <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] mb-4">Admin Dashboard</p>
        <h1 className="text-6xl font-black text-slate-800 tracking-tight">
          Welcome back, <i className="text-indigo-600 font-serif italic font-normal tracking-normal">Principal</i>
        </h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <StatCard label="Total Teachers" value={stats.teachers} icon={Users} color="bg-indigo-50 text-indigo-600" />
        <StatCard label="Total Students" value={stats.students} icon={GraduationCap} color="bg-emerald-50 text-emerald-600" />
        <StatCard label="Pending Approvals" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
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
  )
}


