import { useEffect, useState } from 'react'
import api from '../api'
import { useAuth } from '../context/AuthContext'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts'
import { 
  User, Calendar, FileText, Megaphone, LogOut, 
  TrendingUp, CheckCircle, AlertCircle 
} from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/parent/dashboard')
        setData(data)
      } catch {
        // toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="p-8 text-gray-500">Loading student records...</div>
  if (!data) return <div className="p-8 text-red-500">Could not find student data.</div>

  const { student, attendance, marks, announcements, classTeacher } = data

  // Prepare marks for charts
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <User className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 leading-tight">{student.name}</h1>
              <p className="text-xs text-gray-500">Class {student.class} · {student.studentId}</p>
            </div>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="text-green-600 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{attendance?.percentage ?? 0}%</p>
            <p className="text-xs text-gray-500">Attendance</p>
          </div>
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="text-blue-600 w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-800">{marks.length}</p>
            <p className="text-xs text-gray-500">Exams Taken</p>
          </div>
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <User className="text-purple-600 w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-gray-800">{classTeacher?.name || 'Assigning...'}</p>
            <p className="text-xs text-gray-500">Class Teacher</p>
          </div>
          <div className="card p-4 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
              <Calendar className="text-amber-600 w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-gray-800">{format(new Date(), 'dd MMM yyyy')}</p>
            <p className="text-xs text-gray-500">Today</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" /> Academic Performance
              </h2>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectAvg}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="subject" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-600" /> Recent Results
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Exam','Subject','Marks','Percentage'].map(h => (
                        <th key={h} className="table-th text-[10px]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marks.slice(0, 5).map((m, i) => (
                      <tr key={i}>
                        <td className="table-td text-xs font-medium">{m.examName}</td>
                        <td className="table-td text-xs">{m.subject}</td>
                        <td className="table-td text-xs">{m.marks} / {m.maxMarks}</td>
                        <td className="table-td">
                          <span className={`badge ${
                            (m.percentage ?? 0) >= 75 ? 'bg-green-50 text-green-700' :
                            (m.percentage ?? 0) >= 50 ? 'bg-amber-50 text-amber-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {m.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Announcements & Info */}
          <div className="space-y-6">
            <div className="card p-6 bg-primary-900 text-white shadow-xl">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Megaphone className="w-5 h-5" /> Announcements
              </h2>
              <div className="space-y-4">
                {announcements.length === 0 && <p className="text-sm text-primary-200 italic">No new announcements</p>}
                {announcements.map(ann => (
                  <div key={ann._id} className="border-l-2 border-primary-400 pl-4 py-1">
                    <p className="font-semibold text-sm">{ann.title}</p>
                    <p className="text-xs text-primary-200 mt-1 line-clamp-2">{ann.description}</p>
                    <p className="text-[10px] text-primary-300 mt-2 uppercase">{format(new Date(ann.createdAt), 'dd MMM')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-bold text-gray-800 mb-4">Student Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reg Number</span>
                  <span className="font-medium text-gray-800">{student.regNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email ID</span>
                  <span className="font-medium text-gray-800">{student.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mobile</span>
                  <span className="font-medium text-gray-800">{student.studentMobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium text-gray-800">{student.gender}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
