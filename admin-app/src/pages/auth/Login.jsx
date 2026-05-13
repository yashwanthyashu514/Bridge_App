import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { LogIn, GraduationCap, ShieldCheck, Lock } from 'lucide-react'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const map = { admin: '/admin', teacher: '/teacher', student: '/student', management: '/management' }
      navigate(map[user.role] || '/')
      toast.success(`Welcome back, ${user.name}!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials or account not approved')
    } finally { setLoading(false) }
  }

  return (
  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center p-6 relative overflow-hidden selection:bg-luxury-gold selection:text-luxury-ink">
      
      {/* Decorative High-Fashion Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-20 w-px h-64 bg-luxury-ink/5"></div>
        <div className="absolute top-20 left-20 w-64 h-px bg-luxury-ink/5"></div>
        <div className="absolute bottom-20 right-20 w-px h-64 bg-luxury-ink/5"></div>
        <div className="absolute bottom-20 right-20 w-64 h-px bg-luxury-ink/5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-luxury-ink/[0.02] rounded-full animate-[pulse_10s_infinite]"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Logo Section */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-luxury-yellow rounded-full shadow-[0_20px_50px_rgba(255,225,105,0.4)] mb-8 transition-transform hover:scale-105 duration-700">
            <GraduationCap className="w-10 h-10 text-luxury-ink" />
          </div>
          <h1 className="text-6xl font-medium text-luxury-ink italic tracking-tighter mb-2">Bridge</h1>
          <p className="text-luxury-ink/40 font-medium text-[10px] uppercase tracking-[0.4em] ml-1">Institutional Portal / Est. 2024</p>
        </div>

        {/* Luxury Login Card */}
        <div className="bg-white border border-luxury-ink/5 p-12 md:p-16 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          <div className="mb-12">
            <h2 className="text-3xl font-medium text-luxury-ink italic mb-2 tracking-tight">Private Entry</h2>
            <div className="w-12 h-1 bg-luxury-gold"></div>
          </div>
          
          <form onSubmit={handle} className="space-y-10">
            <div className="group">
              <label className="text-[10px] font-medium text-luxury-ink/40 uppercase tracking-[0.3em] mb-4 block transition-colors group-focus-within:text-luxury-gold">Email Identifier</label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-luxury-ink/10 py-3 focus:border-luxury-gold focus:outline-none transition-all font-medium text-luxury-ink placeholder:text-luxury-ink/20 text-lg italic"
                placeholder="identity@institution.edu"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            
            <div className="group">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[10px] font-medium text-luxury-ink/40 uppercase tracking-[0.3em] transition-colors group-focus-within:text-luxury-gold">Passphrase</label>
                <Link to="#" className="text-[10px] font-medium text-luxury-gold/60 hover:text-luxury-gold uppercase tracking-[0.2em] transition-all italic border-b border-transparent hover:border-luxury-gold">Lost Access?</Link>
              </div>
              <input
                type="password"
                className="w-full bg-transparent border-b border-luxury-ink/10 py-3 focus:border-luxury-gold focus:outline-none transition-all font-medium text-luxury-ink placeholder:text-luxury-ink/20 text-lg italic"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>

            <button type="submit" 
              className="w-full py-6 bg-luxury-yellow text-luxury-ink font-bold text-[11px] tracking-[0.3em] uppercase hover:bg-luxury-gold hover:-translate-y-1 active:translate-y-0 transition-all duration-500 shadow-xl shadow-luxury-yellow/20 relative overflow-hidden group"
              disabled={loading}>
              <span className="relative z-10">{loading ? 'Verifying Identity...' : 'Access Portal'}</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-luxury-ink/5 flex flex-col items-center gap-6">
            <p className="text-[10px] font-medium text-luxury-ink/20 uppercase tracking-[0.2em]">Institutional Access Only</p>
            <Link to="/signup" className="w-full">
              <button className="w-full py-5 border border-luxury-ink/10 text-luxury-ink/40 hover:text-luxury-ink hover:border-luxury-ink rounded-none font-medium text-[10px] tracking-[0.3em] uppercase transition-all duration-500 italic">
                Request Enrollment
              </button>
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center">
          <p className="text-[10px] font-medium text-luxury-ink/30 uppercase tracking-[0.5em] italic">Secure • Encrypted • Editorial</p>
        </div>
      </div>
    </div>
  )
}

  )
}

