import { useNavigate } from 'react-router-dom'
import { LayoutGrid, ChevronRight, X } from 'lucide-react'

export default function AdminHeader({ title, subtitle }) {
  const navigate = useNavigate()

  return (
    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2 italic text-indigo-900">{title}</h1>
          {subtitle && <p className="text-slate-500 font-medium text-lg max-w-2xl">{subtitle}</p>}
        </div>
        
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-bold text-[11px] tracking-[0.2em] uppercase group"
        >
          BACK TO DASHBOARD
          <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-colors shadow-sm bg-white">
            <X className="w-4 h-4 text-slate-500" />
          </div>
        </button>
      </div>
      <div className="h-[1px] w-full bg-slate-100 mt-10"></div>
    </div>
  )
}
