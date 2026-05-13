import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { Users, GraduationCap, Clock, ChevronRight, Trophy, Sparkles, TrendingUp, Bell } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <div className={`bg-white/80 backdrop-blur-xl p-8 rounded-[32px] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group animate-in slide-in-from-bottom-8 fade-in fill-mode-both ${delay}`}>
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${color} shadow-lg shadow-current/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
      <Icon className="w-10 h-10" />
    </div>
    <div>
      <p className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{value}</p>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] mt-1">{label}</p>
    </div>
  </div>
)

const ActionCard = ({ title, desc, icon: Icon, to, color, delay }) => (
  <Link to={to} className={`bg-white p-10 rounded-[40px] border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in slide-in-from-bottom-12 fade-in fill-mode-both ${delay}`}>
    <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${color} shadow-lg shadow-current/10 group-hover:rotate-12 transition-all duration-500`}>
      <Icon className="w-8 h-8" />
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-80">{desc}</p>
    </div>
    <div className="pt-4 flex items-center text-slate-900 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
      Explore Section <ChevronRight className="w-4 h-4 ml-1" />
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
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
        <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        <Sparkles className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="mt-8 font-black tracking-[0.3em] text-[10px] text-slate-400 uppercase animate-pulse">Synchronizing Intelligence...</p>
    </div>
  )

  return (
    <div className="p-8 lg:p-20 max-w-[1600px] mx-auto space-y-20 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full -z-10 animate-pulse delay-1000"></div>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in slide-in-from-top-10 duration-1000">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">System Active</div>
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Institutional <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Intelligence.</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-xl leading-relaxed">
            Welcome, Principal. Your command center is ready. Monitor academic progress and manage institutional growth seamlessly.
          </p>
        </div>
        
        <div className="flex gap-4">
           <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
             <Bell className="w-6 h-6" />
           </button>
           <button className="px-8 h-14 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-3">
             <TrendingUp className="w-5 h-5" /> Analytics Repo
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard label="Teaching Faculty" value={stats.teachers} icon={Users} color="bg-indigo-50 text-indigo-600" delay="delay-100" />
        <StatCard label="Enrolled Students" value={stats.students} icon={GraduationCap} color="bg-emerald-50 text-emerald-600" delay="delay-200" />
        <StatCard label="Pending Admissions" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" delay="delay-300" />
      </section>

      {/* Main Actions */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Core Administrative Modules</h2>
          <div className="h-px bg-slate-100 flex-1"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <ActionCard 
            title="Faculty Directory" 
            desc="Manage the institutional brain. Oversee teacher profiles, subject assignments, and departmental leadership." 
            icon={Users} 
            to="/admin/teachers" 
            color="bg-indigo-600 text-white"
            delay="delay-400"
          />
          <ActionCard 
            title="Academic Registry" 
            desc="The heartbeat of student life. Monitor attendance, academic history, and enrollment life-cycles." 
            icon={GraduationCap} 
            to="/admin/students" 
            color="bg-emerald-600 text-white"
            delay="delay-500"
          />
          <ActionCard 
            title="Academic Honors" 
            desc="Celebrate excellence. Real-time leaderboards tracking top-tier performance across all disciplines." 
            icon={Trophy} 
            to="/admin/leaderboard" 
            color="bg-amber-500 text-white"
            delay="delay-600"
          />
        </div>
      </section>

      {/* Footer Insight */}
      <footer className="bg-slate-900 rounded-[50px] p-16 text-white overflow-hidden relative group animate-in zoom-in-95 duration-1000 delay-700 fill-mode-both">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6">
               <h3 className="text-4xl font-black tracking-tight">Institutional Growth <br /> remains at <span className="text-indigo-400">94.2%</span></h3>
               <p className="text-slate-400 font-medium max-w-md">Your strategic oversight is driving significant improvements in student engagement and faculty performance across all sectors.</p>
            </div>
            <button className="px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-indigo-500/40 hover:bg-indigo-500 transition-all active:scale-95">
               Generate Global Report
            </button>
         </div>
      </footer>
    </div>
  )
}



