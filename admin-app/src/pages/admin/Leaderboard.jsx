import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api'
import { Trophy, Search, Eye, X, ChevronRight, TrendingUp, Users, Award, CheckCircle } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#E5E1DA] flex-1">
    <p className="text-[10px] font-black text-[#9A9483] uppercase tracking-[0.15em] mb-1">{label}</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-black text-[#4B443B]">{value}</span>
      <Icon className={`w-5 h-5 ${color}`} />
    </div>
  </div>
)

const PodiumCard = ({ rank, student, color }) => {
  if (!student) return null;
  const isFirst = rank === 1;
  return (
    <div className={`relative bg-white rounded-[32px] border ${isFirst ? 'border-amber-200 shadow-xl shadow-amber-50' : 'border-[#E5E1DA]'} p-8 flex flex-col items-center flex-1 transition-transform hover:scale-[1.02]`}>
      {isFirst && <Trophy className="w-10 h-10 text-amber-500 absolute -top-5 drop-shadow-md" />}
      <span className="text-2xl font-black text-[#9A9483] mb-4">#{rank}</span>
      <div className={`w-20 h-20 rounded-full ${color} flex items-center justify-center text-white font-black text-xl mb-4 shadow-inner`}>
        {student.name.charAt(0)}
      </div>
      <h3 className="text-lg font-black text-[#4B443B] mb-1 text-center">{student.name}</h3>
      <p className="text-[10px] font-bold text-[#9A9483] uppercase tracking-widest mb-4">Class {student.class} · Sec {student.section || 'A'}</p>
      <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black mb-6">
        {student.avgMarks}%
      </div>
      <Link 
        to={`/admin/student/${student.id}`} 
        className="text-[#9A9483] hover:text-[#4B443B] font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors group/btn"
      >
        View Profile
        <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading]   = useState(true)
  const [cls, setCls]           = useState('')
  const [section, setSection]   = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/teacher/leaderboard?class=${cls}`)
        if (isMounted) setStudents(data)
      } catch (err) {
        console.error('Leaderboard fetch failed', err)
      } finally { 
        if (isMounted) setLoading(false) 
      }
    }
    load()
    return () => { isMounted = false }
  }, [cls])

  const filtered = students.filter(s => 
    (!section || s.section === section) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.studentId?.toLowerCase().includes(search.toLowerCase()))
  )

  const top1 = filtered[0];
  const top2 = filtered[1];
  const top3 = filtered[2];

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-[#9A9483]">
      <div className="w-10 h-10 border-2 border-[#E5E1DA] border-t-amber-500 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Accessing Global Rankings...</p>
    </div>
  )

  return (
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center gap-3 text-[#9A9483] font-bold text-[10px] uppercase tracking-widest mb-4">
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#4B443B]">Leaderboard</span>
          </div>
          <h1 className="text-4xl font-black text-[#4B443B] tracking-tighter mb-2">Global Leaderboard</h1>
          <p className="text-[#9A9483] font-medium">Ranking academic excellence across all disciplines.</p>
        </div>

        <div className="flex items-start gap-8">
          <div className="flex gap-4">
            <select 
              value={cls} 
              onChange={e => setCls(e.target.value)}
              className="bg-white border border-[#E5E1DA] rounded-xl px-4 py-2.5 text-xs font-bold text-[#4B443B] focus:outline-none focus:ring-2 focus:ring-amber-500/10"
            >
              <option value="">All Classes</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
            <select 
              value={section} 
              onChange={e => setSection(e.target.value)}
              className="bg-white border border-[#E5E1DA] rounded-xl px-4 py-2.5 text-xs font-bold text-[#4B443B] focus:outline-none focus:ring-2 focus:ring-amber-500/10"
            >
              <option value="">All Sections</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>
          <button 
            onClick={() => navigate('/admin')} 
            className="flex items-center gap-3 text-[#9A9483] hover:text-[#4B443B] transition-all font-bold text-[11px] tracking-wider uppercase group"
          >
            BACK TO DASHBOARD
            <div className="w-10 h-10 rounded-xl border border-[#E5E1DA] flex items-center justify-center group-hover:border-[#9A9483] transition-colors">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="flex gap-6 mb-12">
        <StatCard label="Total Students" value={students.length} icon={Users} color="text-indigo-500" />
        <StatCard label="Average Score" value="78%" icon={TrendingUp} color="text-emerald-500" />
        <StatCard label="Top Score" value="100%" icon={Award} color="text-amber-500" />
        <StatCard label="Pass Rate" value="100%" icon={CheckCircle} color="text-sky-500" />
      </div>

      {/* Podium Section */}
      <div className="flex items-end gap-6 mb-20 max-w-5xl mx-auto px-10">
        <div className="flex-1 pb-10">
          <PodiumCard rank={2} student={top2} color="bg-slate-400" />
        </div>
        <div className="flex-1 h-full scale-110 z-10">
          <PodiumCard rank={1} student={top1} color="bg-amber-500" />
        </div>
        <div className="flex-1 pb-10">
          <PodiumCard rank={3} student={top3} color="bg-orange-400" />
        </div>
      </div>

      {/* Rankings Table */}
      <div className="bg-white rounded-[40px] border border-[#E5E1DA] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#E5E1DA] flex justify-between items-center bg-[#FAF9F6]/50">
          <h3 className="text-xl font-black text-[#4B443B] tracking-tight">Full Rankings</h3>
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9483]" />
            <input 
              type="text" 
              placeholder="Search students..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E5E1DA] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/10"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF9F6]/30">
                {['Rank', 'Student ID', 'Name', 'Class', 'Section', 'Average Marks', 'Action'].map(h => (
                  <th key={h} className="px-8 py-5 text-[10px] font-black text-[#9A9483] uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E1DA]">
              {filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-[#FAF9F6]/50 transition-all">
                  <td className="px-8 py-6">
                    <span className={`text-sm font-black ${s.rank <= 3 ? 'text-amber-500' : 'text-[#9A9483]'}`}>#{s.rank}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[11px] font-bold text-[#9A9483] bg-[#FAF9F6] px-3 py-1.5 rounded-lg uppercase font-mono">
                      {s.studentId}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-black text-[10px]">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-bold text-[#4B443B] group-hover:text-amber-600 transition-colors">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="badge bg-indigo-50 text-indigo-600 border-none px-4 py-1.5 rounded-xl font-black text-[10px]">Class {s.class}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-[#9A9483]">Section {s.section || 'A'}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <div className="flex-1 h-1.5 bg-[#FAF9F6] rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${s.avgMarks}%` }}></div>
                      </div>
                      <span className="text-sm font-black text-[#4B443B]">{s.avgMarks}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <Link 
                      to={`/admin/student/${s.id}`} 
                      className="w-9 h-9 flex items-center justify-center border border-[#E5E1DA] text-[#9A9483] rounded-xl hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all"
                      title="View Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
