import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { Users, ClipboardCheck, FileSpreadsheet, Clock, Megaphone, Trophy, ChevronRight, LayoutGrid, UserCheck, TrendingUp, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { format } from 'date-fns'

const StatCard = ({ label, value, icon: Icon, color, lightColor }) => (
  <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-6 flex-1 transition-all hover:shadow-md group">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${lightColor}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-tight">{label}</p>
    </div>
  </div>
)

const ActionCard = ({ title, desc, icon: Icon, btnText, onClick, color, lightColor }) => (
  <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-start transition-all hover:shadow-lg group">
    <div className="flex items-center gap-5 mb-8">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${lightColor}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
    </div>
    <p className="text-slate-500 font-medium text-base leading-relaxed mb-10 h-20 overflow-hidden">
      {desc}
    </p>
    <button 
      onClick={onClick}
      className="w-full py-5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-between px-8 group/btn"
    >
      <span>{btnText}</span>
      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </div>
)

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ myStudents: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, pRes] = await Promise.all([
          api.get('/teacher/my-class'),
          api.get('/auth/pending-students')
        ])
        setStats({
          myStudents: sRes.data.length,
          pending:    pRes.data.length
        })
      } catch { /* toast.error('Dashboard load failed') */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      
      {/* Welcome & Date Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Welcome back, {user?.name || 'Yashu'}</h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-[0.2em]">OVERVIEW & QUICK ACTIONS</p>
        </div>
        <div className="bg-white border border-slate-100 px-6 py-3 rounded-full shadow-sm text-sm font-bold text-slate-600 flex items-center gap-3">
          {format(new Date(), 'EEEE, d MMM yyyy')}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="MY CLASS STUDENTS" value={stats.myStudents} icon={Users} color="text-indigo-500" lightColor="bg-indigo-50/50" />
        <StatCard label="PENDING APPROVALS" value={stats.pending} icon={Clock} color="text-amber-500" lightColor="bg-amber-50/50" />
        <StatCard label="TODAY'S ATTENDANCE" value="92%" icon={UserCheck} color="text-emerald-500" lightColor="bg-emerald-50/50" />
        <StatCard label="CLASS AVG SCORE" value="87%" icon={TrendingUp} color="text-sky-500" lightColor="bg-sky-50/50" />
      </div>

      {/* Main Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ActionCard 
          title="My class"
          desc="View and manage student profiles in your assigned class. Monitor progress, update details, and track individual performance."
          icon={Users}
          btnText="Open class directory"
          onClick={() => navigate('/teacher/my-class')}
          color="text-blue-500"
          lightColor="bg-blue-50/50"
        />
        <ActionCard 
          title="Quick attendance"
          desc="Mark today's attendance for your assigned class. Keep records accurate for automated parent notifications."
          icon={ClipboardCheck}
          btnText="Take attendance"
          onClick={() => navigate('/teacher/attendance')}
          color="text-indigo-500"
          lightColor="bg-indigo-50/50"
        />
        <ActionCard 
          title="Academic records"
          desc="Enter examination marks and subject performance data. Records feed directly into the global leaderboard."
          icon={FileSpreadsheet}
          btnText="Marks entry"
          onClick={() => navigate('/teacher/marks')}
          color="text-emerald-500"
          lightColor="bg-emerald-50/50"
        />
        <ActionCard 
          title="Leaderboard"
          desc="View top-performing students ranked by average marks. Identify excellence and areas for improvement."
          icon={Trophy}
          btnText="View rankings"
          onClick={() => navigate('/teacher/leaderboard')}
          color="text-amber-500"
          lightColor="bg-amber-50/50"
        />
        <ActionCard 
          title="Announcements"
          desc="Send important updates to students and parents via WhatsApp and email. Broadcast schedules and news."
          icon={Megaphone}
          btnText="Send announcement"
          onClick={() => navigate('/teacher/announcement')}
          color="text-sky-500"
          lightColor="bg-sky-50/50"
        />
      </div>
    </div>
  )
}
