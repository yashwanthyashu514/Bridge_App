import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api'
import { Eye, Search, GraduationCap, ArrowLeft, Users, UserCheck, UserX, Clock, X, ChevronRight } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
)

export default function StudentDirectory() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState(null)
  const [selectedSection, setSelectedSection] = useState('A')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    
    api.get('/admin/students')
      .then(r => {
        setStudents(r.data);
        if (filter === 'pending') {
          // If we came from the dashboard 'Pending' card, 
          // we don't know the class, so we might want to show all pending
          setSelectedClass('ALL_PENDING');
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id, status) => {
    try {
      await api.put(`/auth/approve/${id}`, { status });
      setStudents(prev => prev.map(s => s._id === id ? { ...s, status } : s));
    } catch (err) {
      console.error(err);
    }
  }

  // Derived Data
  const class11Count = students.filter(s => s.class === '11' && s.status === 'approved').length
  const class12Count = students.filter(s => s.class === '12' && s.status === 'approved').length

  let filteredStudents = students;
  
  if (selectedClass === 'ALL_PENDING') {
    filteredStudents = students.filter(s => s.status === 'pending');
  } else if (selectedClass) {
    filteredStudents = students.filter(s => s.class === selectedClass && s.section === selectedSection);
  }

  if (searchQuery) {
    filteredStudents = filteredStudents.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const stats = {
    total: filteredStudents.length,
    active: filteredStudents.filter(s => s.status === 'approved').length,
    pending: filteredStudents.filter(s => s.status === 'pending').length
  }

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-xs uppercase">Loading Institutional Records...</p>
    </div>
  )

  return (
    <div className="h-screen overflow-y-auto bg-slate-50/30">
      <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-700">
        
        {/* Header Area */}
        <div className="flex justify-between items-start mb-12">
          <div>
            {selectedClass ? (
              <div className="flex items-center gap-3 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
                <button onClick={() => setSelectedClass(null)} className="hover:text-indigo-600 transition-colors">Student Directory</button>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-800">{selectedClass === 'ALL_PENDING' ? 'Pending Approvals' : `Class ${selectedClass}`}</span>
              </div>
            ) : null}
            <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
              {selectedClass === 'ALL_PENDING' ? 'Student Approvals' : selectedClass ? `Class ${selectedClass} Directory` : 'Student Directory'}
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              {selectedClass === 'ALL_PENDING' ? `Managing ${filteredStudents.length} pending requests` : selectedClass ? `Managing students in Class ${selectedClass}` : `${students.length} students currently enrolled`}
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin')} 
            className="flex items-center gap-3 text-slate-500 hover:text-slate-900 transition-all font-bold text-[11px] tracking-wider uppercase group"
          >
            BACK TO DASHBOARD
            <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center group-hover:border-slate-400 transition-colors">
              <X className="w-4 h-4" />
            </div>
          </button>
        </div>

        {!selectedClass ? (
          /* LANDING VIEW: Class Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {[
              { id: '11', count: class11Count, color: 'from-indigo-500 to-indigo-600', icon: GraduationCap },
              { id: '12', count: class12Count, color: 'from-emerald-500 to-emerald-600', icon: GraduationCap }
            ].map(cls => (
              <button 
                key={cls.id}
                onClick={() => setSelectedClass(cls.id)}
                className="relative overflow-hidden group bg-white rounded-[40px] border border-slate-100 p-10 text-left hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500"
              >
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${cls.color} flex items-center justify-center mb-8 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500`}>
                  <cls.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-2">Class {cls.id}</h3>
                <p className="text-slate-500 font-medium mb-6">Explore students, performance, and sections for Class {cls.id}</p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Students</span>
                    <span className="text-2xl font-black text-slate-800">{cls.count}</span>
                  </div>
                  <div className="w-[1px] h-10 bg-slate-100"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sections</span>
                    <span className="text-2xl font-black text-slate-800">3</span>
                  </div>
                </div>
                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-10 group-hover:scale-150 transition-all duration-700">
                  <cls.icon className="w-32 h-32" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* CLASS DETAIL VIEW */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Section Selector Tabs - Hide if in ALL_PENDING */}
            {selectedClass !== 'ALL_PENDING' && (
              <div className="flex gap-2 mb-10 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
                {['A', 'B', 'C'].map(sec => (
                  <button
                    key={sec}
                    onClick={() => setSelectedSection(sec)}
                    className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${
                      selectedSection === sec 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    SECTION {sec}
                  </button>
                ))}
              </div>
            )}

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard label="Total Records" value={stats.total} icon={Users} color="bg-indigo-500" />
              <StatCard label="Approved" value={stats.active} icon={UserCheck} color="bg-emerald-500" />
              <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-500" />
            </div>

            {/* Table Header with Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Roster</h2>
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search students by name or ID..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden mb-10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      {['Avatar', 'Student ID', 'Full Name', 'Class/Sec', 'Reg. No', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s._id} className="group hover:bg-slate-50/30 transition-all">
                        <td className="px-8 py-6">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                            {s.name.charAt(0)}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg uppercase font-mono">
                            {s.studentId || 'N/A'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{s.name}</span>
                        </td>
                        <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                          {s.class}{s.section}
                        </td>
                        <td className="px-8 py-6 text-slate-500 font-medium text-sm">{s.regNumber || '—'}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            s.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
                            s.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {s.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            {s.status === 'pending' ? (
                              <>
                                <button 
                                  onClick={() => handleApprove(s._id, 'approved')}
                                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleApprove(s._id, 'rejected')}
                                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <Link 
                                to={`/admin/student/${s._id}`} 
                                className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-8 py-32 text-center text-slate-300">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p className="font-black uppercase tracking-widest text-xs">No records matching criteria</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <button 
              onClick={() => setSelectedClass(null)}
              className="mt-10 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Class Selection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

