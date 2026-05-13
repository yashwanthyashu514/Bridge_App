import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { FileText, TrendingUp, Calendar, BarChart as BarChartIcon, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid 
} from 'recharts'

export default function StudentMarks() {
  const navigate = useNavigate()
  const [marks, setMarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/student/marks')
        setMarks(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Compiling Academic Records...</p>
    </div>
  )

  // Calculate subject averages for the chart
  const subjectMap = {}
  marks.forEach(m => {
    if (!subjectMap[m.subject]) subjectMap[m.subject] = { subject: m.subject, total: 0, count: 0 }
    if (m.marks !== null) { subjectMap[m.subject].total += m.marks; subjectMap[m.subject].count++ }
  })
  const subjectAvg = Object.values(subjectMap).map(s => ({
    subject: s.subject,
    avg: s.count ? +(s.total / s.count).toFixed(1) : 0
  }))

  return (
    <div className="p-8 md:p-12 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-3 text-indigo-500 font-bold text-[10px] uppercase tracking-widest mb-4">
             <BarChartIcon className="w-4 h-4" />
             <span>Academic Analytics</span>
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">My Academic Records</h1>
          <p className="text-slate-500 font-medium">A detailed analysis of your examination performance and historical data.</p>
        </div>
        <button 
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <span>Back to Dashboard</span>
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr>
                {['Exam Name','Subject','Date','Score','Max','Result'].map(h => (
                  <th key={h} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left border-b border-slate-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.map((m, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-8 font-black text-slate-800">{m.examName}</td>
                  <td className="px-8 py-8">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">{m.subject}</span>
                  </td>
                  <td className="px-8 py-8 text-sm font-bold text-slate-400">{m.date ? format(new Date(m.date), 'dd MMM yyyy') : '—'}</td>
                  <td className="px-8 py-8 font-black text-indigo-600 text-lg">{m.marks ?? '—'}</td>
                  <td className="px-8 py-8 text-sm font-bold text-slate-300">{m.maxMarks}</td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        (m.percentage ?? 0) >= 75 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        (m.percentage ?? 0) >= 50 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {m.percentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {marks.length === 0 && (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">No academic records found yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Performance Chart */}
        <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10">
          <h2 className="font-black text-slate-800 mb-8 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-indigo-600" /> Subject-wise Performance Average
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAvg}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 10}} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 700, fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 800 }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="avg" fill="#6366f1" radius={[12, 12, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

