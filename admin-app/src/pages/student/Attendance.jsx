import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api'
import { Calendar, CheckCircle, XCircle, AlertCircle, Clock, BookOpen, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export default function StudentAttendance() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/student/attendance')
        setData(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading attendance...</div>
  if (!data) return <div className="p-8 text-red-500">Failed to load data</div>

  return (
    <div className="p-8">
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">My Attendance Report</h1>
          <p className="text-slate-500 font-medium">Summary of your presence and punctuality across all subjects.</p>
        </div>
        <button 
          onClick={() => navigate('/student')}
          className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm text-slate-400 hover:text-indigo-600 hover:shadow-md transition-all font-bold text-[10px] uppercase tracking-widest group"
        >
          <span>Back to Dashboard</span>
          <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 border-l-4 border-primary-500 bg-primary-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Classes</p>
          <h2 className="text-3xl font-black text-gray-800">{data.total}</h2>
        </div>
        <div className="card p-6 border-l-4 border-green-500 bg-green-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Present</p>
          <h2 className="text-3xl font-black text-green-700">{data.present}</h2>
        </div>
        <div className="card p-6 border-l-4 border-red-500 bg-red-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Absent</p>
          <h2 className="text-3xl font-black text-red-700">{data.absent}</h2>
        </div>
        <div className="card p-6 border-l-4 border-amber-500 bg-amber-50/30">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Leave</p>
          <h2 className="text-3xl font-black text-amber-700">{data.leave}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Today's Subject Attendance */}
          <div className="card p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" /> Today's Subject Attendance
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Subject</th>
                    <th className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.todayRecords?.length > 0 ? (
                    data.todayRecords.map((r, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 text-sm font-medium">Period {r.period} ({r.session})</td>
                        <td className="px-4 py-3 text-sm">{r.subject || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            r.status === 'present' ? 'bg-green-100 text-green-700' :
                            r.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-400 text-sm italic">
                        No attendance recorded for today yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-8 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-gray-800 mb-6 uppercase tracking-widest text-sm">Overall Attendance Health</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
                <circle 
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - data.percentage / 100)}
                  strokeLinecap="round"
                  className={`transition-all duration-1000 ${
                    data.percentage >= 75 ? 'text-green-500' :
                    data.percentage >= 50 ? 'text-amber-500' : 'text-red-500'
                  }`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-800">{data.percentage}%</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Average</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 bg-slate-900 text-white shadow-2xl">
             <h3 className="font-bold text-sm mb-4">Quick Tip</h3>
             <p className="text-xs text-slate-400 leading-relaxed">
               Regular attendance is linked to better academic performance. Aim for at least 85% to stay on track with your studies!
             </p>
          </div>
          
          <div className="card p-6 border-dashed border-2 border-primary-100 bg-primary-50/20">
             <h3 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-primary-600" /> Need Help?
             </h3>
             <p className="text-xs text-gray-500 leading-relaxed">
               If you believe there is an error in your attendance record, please contact your Class Teacher immediately.
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}
