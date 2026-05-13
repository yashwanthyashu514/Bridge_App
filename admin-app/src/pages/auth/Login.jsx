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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans" 
      style={{ 
        background: 'linear-gradient(-45deg, #001D4D, #0A2F66, #1a4d7f, #003d99)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}>
      
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(3deg); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.7)); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-slide { opacity: 0; animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .input-focus-lift { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .input-focus-lift:focus { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1); }
      `}</style>

      {/* Background Particles Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-[360px] relative z-10">
        
        {/* Animated Logo Section */}
        <div className="text-center mb-6 animate-slide" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-2xl mb-4 relative group transition-transform hover:scale-110 duration-500"
            style={{ animation: 'float 6s ease-in-out infinite, glow 4s ease-in-out infinite' }}>
            <GraduationCap className="w-8 h-8 text-[#0A2F66] transform -rotate-3 transition-transform group-hover:rotate-0" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl blur opacity-15 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter mb-1 drop-shadow-lg">Bridge App</h1>
          <p className="text-blue-100/60 font-bold text-[10px] uppercase tracking-[0.2em]">Institutional Portal</p>
        </div>

        {/* Premium Login Card */}
        <div className={`bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20 transition-all duration-700 animate-slide ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
          style={{ animationDelay: '0.25s' }}>
          
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6 animate-slide" style={{ animationDelay: '0.4s' }}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden group">
                <Lock className="w-4 h-4 text-blue-600 relative z-10 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-100/30 to-transparent animate-[shimmer_2s_infinite]"></div>
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Secure Unified Login</h2>
            </div>
            
            <form onSubmit={handle} className="space-y-6">
              <div className="animate-slide" style={{ animationDelay: '0.5s' }}>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Email Address / User ID</label>
                <input
                  type="email"
                  className="w-full px-5 py-3.5 bg-[#fafafa] border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm text-sm"
                  placeholder="name@college.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              
              <div className="animate-slide" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Password</label>
                  <Link to="#" className="text-[9px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  className="w-full px-5 py-3.5 bg-[#fafafa] border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300 shadow-sm text-sm"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
              </div>

              <button type="submit" 
                className="w-full py-4 bg-[#0A2F66] text-white rounded-2xl font-black text-xs tracking-widest uppercase flex items-center justify-center gap-3 shadow-[0_15px_30px_-10px_rgba(10,47,102,0.4)] hover:shadow-[0_20px_40px_-12px_rgba(10,47,102,0.5)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 relative overflow-hidden group animate-slide"
                style={{ animationDelay: '0.7s' }}
                disabled={loading}>
                <span className="relative z-10">{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                <LogIn className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-3 animate-slide" style={{ animationDelay: '0.8s' }}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">New Student?</p>
              <Link to="/signup" className="w-full">
                <button className="w-full py-4 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-black text-xs tracking-widest uppercase hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 shadow-sm active:scale-[0.98]">
                  Create Student Account
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-4 gap-3 px-6 animate-slide" style={{ animationDelay: '0.9s' }}>
          {['Admin','Staff','Student','Mgmt'].map(r => (
            <div key={r} className="text-[9px] font-black text-white/40 uppercase text-center bg-white/5 backdrop-blur-sm py-2 rounded-xl border border-white/5 tracking-widest">{r}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

