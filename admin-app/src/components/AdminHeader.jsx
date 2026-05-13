import { useNavigate } from 'react-router-dom'
import { LayoutGrid, ChevronRight, X } from 'lucide-react'

export default function AdminHeader({ title, subtitle }) {
  const navigate = useNavigate()

  return (
    <div className="mb-20 animate-in fade-in slide-in-from-top-6 duration-1000">
      <div className="flex justify-between items-end border-b border-luxury-ink/10 pb-10">
        <div className="space-y-4">
          <h1 className="text-5xl font-medium text-luxury-ink italic tracking-tight">{title}</h1>
          {subtitle && <p className="text-luxury-ink/60 font-medium text-xl max-w-2xl italic">{subtitle}</p>}
        </div>
        
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-4 text-luxury-ink/40 hover:text-luxury-gold transition-all font-medium text-[10px] tracking-[0.3em] uppercase group"
        >
          <span className="border-b border-transparent group-hover:border-luxury-gold pb-1 transition-all">RETURN TO PORTAL</span>
          <div className="w-12 h-12 rounded-full border border-luxury-ink/10 flex items-center justify-center group-hover:border-luxury-gold transition-all bg-transparent overflow-hidden relative">
            <div className="absolute inset-0 bg-luxury-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <X className="w-5 h-5 relative z-10 transition-colors group-hover:text-luxury-ink" />
          </div>
        </button>
      </div>
    </div>

  )
}
