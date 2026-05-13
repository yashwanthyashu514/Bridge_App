import { useEffect, useState } from 'react'
import api from '../../api'
import { 
  CheckCircle, FileText, TrendingUp, Calendar,
  Clock, GraduationCap, UserCheck, LogOut
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { format } from 'date-fns'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/student/dashboard')
        setData(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-12 h-12 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase animate-pulse">Personalizing your experience...</p>
    </div>
  )
  if (!data) return <div className="p-8 text-red-500">No data found.</div>

  const { student, attendance, marks, announcements } = data

  return (
    <div className="p-8 md:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Header with Animation */}
      <div className="flex items-center justify-between animate-in slide-in-from-top-4 duration-700">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">Student Dashboard</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back, <span className="text-indigo-600 font-bold">{student.name}</span>. Here's your overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-bold text-slate-700">{format(new Date(), 'EEEE, dd MMMM')}</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-rose-100 transition-all border border-rose-100 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-12">
        {/* Stats Cards - Animated Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 animate-in slide-in-from-bottom-8 delay-100 fill-mode-both">
            <div className="flex items-center justify-between mb-6">
               <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                 <CheckCircle className="w-7 h-7" />
               </div>
               <span className="text-4xl font-black text-slate-800 tracking-tighter">{attendance?.percentage ?? 0}%</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Overall Attendance</p>
            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-emerald-500 rounded-full transition-all duration-1000 delay-500" 
                 style={{ width: `${attendance?.percentage ?? 0}%` }}
               ></div>
            </div>
          </div>

          <div className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 animate-in slide-in-from-bottom-8 delay-200 fill-mode-both">
            <div className="flex items-center justify-between mb-6">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                 <FileText className="w-7 h-7" />
               </div>
               <span className="text-4xl font-black text-slate-800 tracking-tighter">{marks.length}</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exams Attempted</p>
          </div>

          <div className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 animate-in slide-in-from-bottom-8 delay-300 fill-mode-both">
            <div className="flex items-center justify-between mb-6">
               <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                 <Calendar className="w-7 h-7" />
               </div>
               <div className="text-right">
                  <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Today's Status</span>
                  <h3 className="text-lg font-black text-slate-800 leading-tight mt-1">
                    {attendance?.todayStatus === 'present' ? 'Present' : 
                     attendance?.todayStatus === 'absent' ? 'Absent' : 
                     'Not Marked'}
                  </h3>
               </div>
            </div>
          </div>
        </div>

        {/* Quick Access Grid - Horizontal Layout */}
        <div className="space-y-6 animate-in slide-in-from-bottom-8 delay-400 fill-mode-both">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
             {[
               { id: 'marks', icon: FileText, label: 'My Marks', color: 'blue', to: '/student/marks' },
               { id: 'attendance', icon: UserCheck, label: 'Attendance', color: 'emerald', to: '/student/attendance' },
               { id: 'timetable', icon: Clock, label: 'Timetable', color: 'indigo', to: '/student/timetable' },
               { id: 'calendar', icon: Calendar, label: 'Calendar', color: 'rose', to: '/student/calendar' },
               { id: 'learn', icon: GraduationCap, label: 'Learning Portal', color: 'amber', to: '/student/learn' }
             ].map((item, idx) => (
               <button 
                 key={item.id}
                 onClick={() => navigate(item.to)}
                 className="group bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center gap-4"
               >
                  <div className={`w-16 h-16 bg-${item.color}-50 rounded-[24px] flex items-center justify-center text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                     <item.icon className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
               </button>
             ))}
          </div>
        </div>

        {/* Announcements - Full Width Animated */}
        <div className="bg-slate-900 rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-8 delay-500 fill-mode-both">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-indigo-400" /> Recent Announcements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map((ann, idx) => (
                <div 
                  key={ann._id} 
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[32px] hover:bg-white/10 transition-colors group"
                >
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">{format(new Date(ann.createdAt), 'dd MMM yyyy')}</p>
                  <h3 className="text-lg font-black mb-3 group-hover:text-indigo-300 transition-colors">{ann.title}</h3>
                  <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-4">{ann.description}</p>
                </div>
              ))}
              {announcements.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500 font-bold uppercase tracking-widest">
                  No new announcements at this time.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
