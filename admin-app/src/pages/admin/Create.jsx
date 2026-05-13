import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import AdminHeader from '../../components/AdminHeader'
import { GraduationCap, Briefcase, Eye, EyeOff, UserPlus, Copy } from 'lucide-react'


export default function AdminCreate() {
  const navigate = useNavigate()
  const [type, setType]     = useState('teacher') // 'teacher' | 'management'
  const [form, setForm]     = useState({ 
    name: '', 
    designation: '', 
    subject: '', 
    classAssigned: '',
    section: '',
    email: '', 
    password: '' 
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [created, setCreated] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/admin/create-staff', { ...form, role: type })
      setCreated(data)
      setForm({ name: '', designation: '', subject: '', classAssigned: '', section: '', email: '', password: '' })
      toast.success(`${type === 'teacher' ? 'Teacher' : 'Management staff'} created!`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="p-10 lg:p-16 max-w-[1000px] mx-auto animate-in fade-in duration-700">
      
      <AdminHeader 
        title="Create Staff Account" 
        subtitle="Provision access for teaching faculty and management personnel" 
      />

      {/* Staff Type Switcher */}
      <div className="flex gap-4 mb-10">
        {[
          { id: 'teacher', label: 'Teaching Staff', icon: GraduationCap },
          { id: 'management', label: 'Non-Teaching (Management)', icon: Briefcase }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => setType(t.id)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border-2 ${
              type === t.id 
                ? 'bg-white border-slate-900 text-slate-900 shadow-xl shadow-slate-100 scale-105' 
                : 'bg-slate-50 border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <t.icon className="w-5 h-5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100 p-10 md:p-16">
        <form onSubmit={handle} className="space-y-12">
          
          {/* Personal Info Section */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name <span className="text-rose-500">*</span></label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Full name" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Designation <span className="text-rose-500">*</span></label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  value={form.designation} onChange={e => set('designation', e.target.value)} required
                  placeholder={type === 'teacher' ? 'e.g. Lecturer, HOD' : 'e.g. Accountant, Clerk'} 
                />
              </div>
              {type === 'teacher' && (
                <>
                  <div className="col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Subject <span className="text-rose-500">*</span></label>
                    <input 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                      value={form.subject} onChange={e => set('subject', e.target.value)} required
                      placeholder="e.g. Physics, Mathematics" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Class Assigned</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 appearance-none"
                      value={form.classAssigned} onChange={e => set('classAssigned', e.target.value)}
                    >
                      <option value="">Select class</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Section</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 appearance-none"
                      value={form.section} onChange={e => set('section', e.target.value)}
                    >
                      <option value="">Select section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* Login Credentials Section */}
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email / Login ID <span className="text-rose-500">*</span></label>
                <input 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="staff@institution.edu"
                />
                <p className="text-[10px] text-slate-400 font-bold ml-1">This will be used to log in to the portal</p>
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-bold text-slate-700 ml-1">Password <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input 
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                    type={showPassword ? "text" : "password"} value={form.password} onChange={e => set('password', e.target.value)} required placeholder="Temporary password" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-bold ml-1">Minimum 8 characters</p>
              </div>
            </div>
          </section>

          <div className="flex items-center gap-4 pt-6">
            <button 
              type="submit" 
              className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
              disabled={loading}
            >
              <UserPlus className="w-5 h-5" />
              {loading ? 'Creating...' : `Create ${type === 'teacher' ? 'Teacher' : 'Management'} Account`}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/admin')}
              className="px-10 py-5 bg-white border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Success Card */}
      {created && (
        <div className="mt-10 bg-emerald-50 rounded-[32px] border-2 border-emerald-100 p-8 flex items-center justify-between animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
              <UserPlus className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-900 tracking-tight">Account Created Successfully</h3>
              <p className="text-emerald-700 font-medium opacity-70">Employee ID: <span className="font-mono font-black">{created.employeeId}</span></p>
            </div>
          </div>
          <button 
            onClick={() => { navigator.clipboard.writeText(created.employeeId); toast.success('ID Copied') }}
            className="p-4 bg-white rounded-2xl text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
          >
            <Copy className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  )
}
