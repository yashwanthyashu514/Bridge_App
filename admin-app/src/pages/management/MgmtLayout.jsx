import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, IndianRupee, Table, Calendar, Settings, LogOut, GraduationCap } from 'lucide-react'

const links = [
  { to: '/management',            label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/management/fees',       label: 'Fees Management', icon: IndianRupee },
  { to: '/management/timetable',  label: 'Timetable',      icon: Table },
  { to: '/management/calendar',   label: 'College Calendar', icon: Calendar },
  { to: '/management/set-fees',   label: 'Set College Fees', icon: Settings }
]

export default function MgmtLayout() {
  const { logout } = useAuth()

  return (
    <div className="flex h-screen bg-[#F8FAFC] p-4 gap-4 overflow-hidden">
      {/* Round Rectangular Sidebar */}
      <aside className="w-72 bg-slate-900 rounded-[32px] flex flex-col shadow-2xl shadow-slate-200 overflow-hidden shrink-0 animate-in slide-in-from-left duration-700">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-tight text-lg leading-tight">Bridge</h2>
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Management</p>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/management'}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 translate-x-2'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-800/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden overflow-y-auto animate-in fade-in zoom-in-95 duration-1000">
        <Outlet />
      </main>
    </div>
  )
}
