import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Plus, Megaphone, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">Admin Portal</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/create" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Plus className="w-4 h-4 text-indigo-600" />
              Create Staff
            </Link>
            <Link to="/admin/announcement" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Megaphone className="w-4 h-4 text-indigo-600" />
              Send Announcement
            </Link>
            <button onClick={logout} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm ml-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto">
        <Outlet />
      </main>
    </div>
  )
}
