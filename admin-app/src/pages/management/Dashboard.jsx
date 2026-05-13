import { useEffect, useState } from 'react'
import api from '../../api'
import { IndianRupee, Users, Calendar, AlertCircle, TrendingUp, ArrowRight, Wallet, Activity } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, gradient, index }) => (
  <div 
    className="relative group overflow-hidden bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 animate-in slide-in-from-bottom-8 fill-mode-both"
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-700`} />
    
    <div className="flex flex-col gap-6 relative z-10">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg shadow-indigo-100`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{value}</h3>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  </div>
)

export default function MgmtDashboard() {
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    totalCollected: 0, 
    totalPending: 0,
    upcomingEvents: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, fRes, cRes] = await Promise.all([
          api.get('/admin/students?status=approved'),
          api.get('/management/fees'),
          api.get('/management/calendar')
        ])
        
        const totalPaid = fRes.data.reduce((acc, f) => acc + f.paid, 0)
        const totalFees = fRes.data.reduce((acc, f) => acc + f.totalFees, 0)

        setStats({
          totalStudents: sRes.data.length,
          totalCollected: totalPaid,
          totalPending: totalFees - totalPaid,
          upcomingEvents: cRes.data.length
        })
      } catch { }
      finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Compiling Insights...</p>
    </div>
  )

  return (
    <div className="p-10 md:p-14">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 text-indigo-500 font-bold text-[10px] uppercase tracking-widest mb-3">
             <Activity className="w-4 h-4" />
             <span>Institutional Overview</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Management Dashboard</h1>
          <p className="text-slate-500 font-medium">Financial and operational performance metrics for the current session.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 animate-in slide-in-from-right duration-700">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Year</p>
            <p className="text-sm font-bold text-slate-700">2025 - 2026</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <StatCard label="Student Base" value={stats.totalStudents} icon={Users} gradient="from-indigo-600 to-violet-600" index={0} />
        <StatCard label="Fee Collection" value={`₹${stats.totalCollected.toLocaleString()}`} icon={Wallet} gradient="from-emerald-500 to-teal-600" index={1} />
        <StatCard label="Outstanding" value={`₹${stats.totalPending.toLocaleString()}`} icon={AlertCircle} gradient="from-rose-500 to-orange-600" index={2} />
        <StatCard label="Scheduled Events" value={stats.upcomingEvents} icon={Calendar} gradient="from-amber-500 to-orange-500" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 group bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-500 animate-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Financial Trajectory</h2>
              <p className="text-slate-400 text-sm font-medium">Monthly collection trends and revenue analysis.</p>
            </div>
            <button className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all">
              Detailed Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="h-64 bg-slate-50 rounded-[32px] flex items-center justify-center relative overflow-hidden border border-slate-100/50">
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent" />
             <div className="relative z-10 flex flex-col items-center gap-4 text-slate-300">
                <TrendingUp className="w-12 h-12 opacity-20" />
                <p className="font-bold tracking-widest text-[10px] uppercase italic">Visualizing Financial Data...</p>
             </div>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-200 animate-in slide-in-from-bottom-8 fill-mode-both" style={{ animationDelay: '500ms' }}>
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-500/20">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black mb-6 tracking-tight">Institutional Health</h2>
          
          <div className="space-y-6">
             <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Attendance Rate</span>
                <span className="text-xl font-black text-indigo-400">94%</span>
             </div>
             <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Exam Completion</span>
                <span className="text-xl font-black text-emerald-400">100%</span>
             </div>
             <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Fee Compliance</span>
                <span className="text-xl font-black text-amber-400">82%</span>
             </div>
          </div>

          <div className="mt-10 p-6 bg-indigo-600 rounded-3xl">
             <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Pro Tip</p>
             <p className="text-sm font-medium leading-relaxed">Regularly update the college calendar to keep students and staff informed about upcoming events.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
