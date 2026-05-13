import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { Send, Megaphone, X, MessageSquare, Mail, Clock, CheckCircle, ChevronRight, Users } from 'lucide-react'
import AdminHeader from '../../components/AdminHeader'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'

const AUDIENCE = [
  { key: 'all',     label: 'All' },
  { key: 'parent',  label: 'Parents' },
  { key: 'teacher', label: 'Teachers' },
  { key: 'student', label: 'Students' }
]

export default function Announcement() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', sendTo: [] })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sendChannels, setSendChannels] = useState(['whatsapp', 'email'])

  // Teacher can only send to parent + student
  const audienceOptions = user?.role === 'teacher'
    ? AUDIENCE.filter(a => ['parent','student'].includes(a.key))
    : AUDIENCE

  useEffect(() => {
    api.get('/admin/announcements')
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleAudience = (key) => {
    if (key === 'all') {
      setForm(f => ({ ...f, sendTo: f.sendTo.includes('all') ? [] : ['all'] }))
    } else {
      setForm(f => ({
        ...f,
        sendTo: f.sendTo.includes(key)
          ? f.sendTo.filter(k => k !== key && k !== 'all')
          : [...f.sendTo.filter(k => k !== 'all'), key]
      }))
    }
  }

  const send = async (e) => {
    e.preventDefault()
    if (!form.sendTo.length) return toast.error('Select at least one audience')
    setSending(true)
    try {
      await api.post('/admin/announcement', {
        ...form,
        sentViaWhatsapp: sendChannels.includes('whatsapp'),
        sentViaEmail: sendChannels.includes('email')
      })
      toast.success('Announcement sent!')
      setForm({ title: '', description: '', sendTo: [] })
      const r = await api.get('/admin/announcements')
      setHistory(r.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send')
    } finally { setSending(false) }
  }

  return (
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      
      <AdminHeader 
        title="Announcements" 
        subtitle="Broadcast messages via WhatsApp and email to the institution" 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Compose Form */}
        <div className="lg:col-span-7 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-100 p-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Announcement</h2>
          </div>

          <form onSubmit={send} className="space-y-8">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Title <span className="text-rose-500">*</span></label>
              <input 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                placeholder="Announcement title" 
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
                required 
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700 ml-1">Send To <span className="text-rose-500">*</span></label>
              <div className="flex gap-3 flex-wrap">
                {audienceOptions.map(({ key, label }) => (
                  <button 
                    key={key} 
                    type="button"
                    onClick={() => toggleAudience(key)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black tracking-wider uppercase transition-all border-2 ${
                      form.sendTo.includes(key)
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-slate-700 ml-1">Send Via</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'whatsapp', label: 'WhatsApp', desc: 'Instant delivery', icon: MessageSquare },
                  { id: 'email', label: 'Email', desc: 'Full message', icon: Mail }
                ].map(ch => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSendChannels(prev => prev.includes(ch.id) ? prev.filter(x => x !== ch.id) : [...prev, ch.id])}
                    className={`p-5 rounded-3xl border-2 text-left transition-all ${
                      sendChannels.includes(ch.id)
                        ? 'bg-indigo-50 border-indigo-600 shadow-lg shadow-indigo-100'
                        : 'bg-white border-slate-100 grayscale opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-3 rounded-xl ${sendChannels.includes(ch.id) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <ch.icon className="w-5 h-5" />
                      </div>
                      {sendChannels.includes(ch.id) && <CheckCircle className="w-5 h-5 text-indigo-600" />}
                    </div>
                    <p className={`font-black text-sm ${sendChannels.includes(ch.id) ? 'text-indigo-900' : 'text-slate-400'}`}>{ch.label}</p>
                    <p className={`text-[10px] font-bold ${sendChannels.includes(ch.id) ? 'text-indigo-400' : 'text-slate-300'}`}>{ch.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Description <span className="text-rose-500">*</span></label>
              <textarea 
                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-3xl focus:bg-white focus:border-slate-900 focus:outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400 resize-none min-h-[160px]"
                placeholder="Announcement content..." 
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
                required 
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              disabled={sending}
            >
              <Send className="w-5 h-5" />
              {sending ? 'Sending...' : 'Send Announcement'}
            </button>
          </form>
        </div>

        {/* History Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Recent History</h2>
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              {history.length} Sent
            </span>
          </div>

          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
            {history.length === 0 && !loading && (
              <div className="bg-slate-50 rounded-3xl p-10 text-center border border-dashed border-slate-200">
                <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No announcements yet</p>
              </div>
            )}
            {history.map(ann => (
              <div key={ann._id} className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{ann.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" /> {format(new Date(ann.createdAt), 'dd MMM yyyy · hh:mm a')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-200 transition-colors" />
                </div>
                <p className="text-slate-500 text-sm font-medium line-clamp-3 mb-6 leading-relaxed">
                  {ann.description}
                </p>
                <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                  <div className="flex -space-x-2">
                    {ann.sendTo.map(t => (
                      <div key={t} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black uppercase text-slate-600" title={t}>
                        {t.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 ml-auto">
                    {ann.sentViaWhatsapp && <MessageSquare className="w-4 h-4 text-emerald-500" title="WhatsApp" />}
                    {ann.sentViaEmail && <Mail className="w-4 h-4 text-sky-500" title="Email" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
