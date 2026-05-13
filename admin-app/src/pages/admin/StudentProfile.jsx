import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Shield, GraduationCap, Award, TrendingUp, Users, CheckCircle2, FileText } from 'lucide-react'

import AdminHeader from '../../components/AdminHeader'

const ProfileStat = ({ label, value, icon: Icon, color, subtext }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex-1 transition-all hover:shadow-xl hover:shadow-slate-100 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-indigo-100`}>
        <Icon className="w-6 h-6" />
      </div>
      {subtext && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{subtext}</span>}
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
  </div>
)

export default function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent]   = useState(null)
  const [marks, setMarks]       = useState([])
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, mRes, aRes] = await Promise.all([
          api.get(`/student/profile/${id}`),
          api.get(`/student/marks/${id}`),
          api.get(`/student/attendance/${id}`)
        ])
        setStudent(sRes.data)
        setMarks(mRes.data)
        setAttendance(aRes.data)
      } finally { setLoading(false) }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase tracking-[0.2em]">Assembling Academic Portfolio...</p>
    </div>
  )
  if (!student) return <div className="p-20 text-rose-500 font-black text-center uppercase tracking-widest">Student record not found in system</div>

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
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      <AdminHeader 
        title="Academic Portfolio" 
        subtitle={`Comprehensive performance metrics and personal records for ${student.name}`} 
      />

      {/* Main Profile Header Card */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row gap-10 items-center">
        <div className="w-40 h-40 rounded-[40px] bg-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-indigo-200">
          {student.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter">{student.name}</h1>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active Student</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-bold text-sm mb-6">
            <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> {student.studentId}</span>
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Class {student.class} · Section {student.section || 'A'}</span>
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {new Date(student.createdAt).getFullYear()}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Registration</p>
              <p className="text-sm font-black text-slate-700">{student.regNumber}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Roll Number</p>
              <p className="text-sm font-black text-slate-700">{student.rollNumber || '00'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Guardian Mobile</p>
              <p className="text-sm font-black text-slate-700">{student.parentMobile || 'Not Provided'}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Blood Group</p>
              <p className="text-sm font-black text-slate-700">{student.bloodGroup || 'O+'}</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-64 bg-slate-50 p-8 rounded-[40px] flex flex-col items-center justify-center border border-slate-100">
          <div className={`text-5xl font-black mb-2 ${
            (attendance?.percentage ?? 0) >= 75 ? 'text-emerald-600' :
            (attendance?.percentage ?? 0) >= 50 ? 'text-amber-600' : 'text-rose-600'
          }`}>{attendance?.percentage ?? 0}%</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Overall Attendance</p>
        </div>
      </div>

      {/* Attendance Stats Grid */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <ProfileStat label="Days Present" value={attendance?.present ?? 0} icon={CheckCircle2} color="bg-emerald-500" subtext="In-Class" />
        <ProfileStat label="Days Absent" value={attendance?.absent ?? 0} icon={ArrowLeft} color="bg-rose-500" subtext="Unexcused" />
        <ProfileStat label="Leave Taken" value={attendance?.leave ?? 0} icon={Users} color="bg-amber-500" subtext="Authorized" />
        <ProfileStat label="Academic Rank" value="#4" icon={Award} color="bg-indigo-600" subtext="Class Rank" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Subject Average Marks</h2>
          </div>
          {subjectAvg.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectAvg}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fontWeight: 'bold', fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                />
                <Bar dataKey="avg" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-300 font-bold uppercase text-xs tracking-widest">No Marks Data Available</div>
          )}
        </div>

        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Performance Radar</h2>
          </div>
          {subjectAvg.length >= 3 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={subjectAvg}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
                <Radar dataKey="avg" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={3} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-300 font-bold uppercase text-xs tracking-widest text-center px-10">
              Need at least 3 subjects to generate radar analysis
            </div>
          )}
        </div>
      </div>

      {/* Detailed Marks Table */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden mb-20">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Detailed Examination History</h2>
          <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
            {marks.length} Assessments
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                {['Examination Name', 'Subject', 'Marks', 'Percentage', 'Grade Status'].map(h => (
                  <th key={h} className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {marks.map((m, i) => {
                const perc = m.percentage ?? 0;
                return (
                  <tr key={i} className="group hover:bg-slate-50/30 transition-all">
                    <td className="px-10 py-7 font-black text-slate-800 text-sm italic">{m.examName}</td>
                    <td className="px-10 py-7">
                      <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-black uppercase tracking-tighter">
                        {m.subject}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-sm font-bold text-slate-500">
                      <span className="text-slate-800 font-black">{m.marks ?? '—'}</span> / {m.maxMarks}
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              perc >= 75 ? 'bg-emerald-500' : perc >= 40 ? 'bg-indigo-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${perc}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-600">{perc}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        perc >= 75 ? 'bg-emerald-50 text-emerald-600' :
                        perc >= 40 ? 'bg-indigo-50 text-indigo-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {perc >= 75 ? 'Distinction' : perc >= 60 ? 'First Class' : perc >= 40 ? 'Pass' : 'Requires Attention'}
                      </span>
                    </td>
                  </tr>
                )
              })}
              {marks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-32 text-center text-slate-300">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="font-black uppercase tracking-widest text-xs">No academic records found for this student</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
