import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Megaphone, UserCheck, LogOut, GraduationCap, Bell, Settings } from 'lucide-react'

export default function TeacherLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="h-screen bg-[#FDFDFD] font-sans text-slate-900 flex flex-col overflow-hidden">
      {/* High-End Institutional Header */}
      <header className="bg-[#2D2B52] text-white sticky top-0 z-50 shadow-md h-20">
        <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block leading-none">Bridge App</span>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60">TEACHER PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6 pr-8 border-r border-white/10">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-80 hover:opacity-100">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-80 hover:opacity-100">
                <Megaphone className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-indigo-400 rounded-full flex items-center justify-center font-black text-sm shadow-inner ring-2 ring-white/10">
                {user?.name?.charAt(0) || 'Y'}
              </div>
              <button 
                onClick={logout}
                className="p-2 hover:bg-rose-500 rounded-lg transition-colors opacity-80 hover:opacity-100"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
