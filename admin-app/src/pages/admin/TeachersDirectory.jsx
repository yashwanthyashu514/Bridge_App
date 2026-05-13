
import { useEffect, useState } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'
import { Edit2, Trash2, Save, X, ArrowLeft, Users, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ALL_DEPARTMENTS = [
  'Physics', 'Chemistry', 'Biology', 'Maths', 
  'Computer Science', 'Kannada', 'English', 'Hindi'
]

const LOGO_MAP = {
  'Physics': '/physicslogo.jpeg',
  'Chemistry': '/chemistrylogo.jpeg',
  'Biology': '/biologylogo.jpeg',
  'Maths': '/mathslogo.jpeg',
  'Computer Science': '/computersciencelogo.png',
  'Kannada': '/kannadalogo.jpg',
  'English': '/englishlogo.jpg',
  'Hindi': '/hindilogo.jpg'
}

const DepartmentCard = ({ name, count, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all group w-full ${
      isActive 
        ? 'bg-white border-indigo-200 shadow-lg ring-1 ring-indigo-100' 
        : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
    }`}
  >
    <div className={`w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center mb-4 transition-all ${
      isActive ? 'shadow-lg shadow-indigo-100 scale-110' : 'opacity-80 group-hover:opacity-100 group-hover:scale-110'
    }`}>
      {LOGO_MAP[name] ? (
        <img src={LOGO_MAP[name]} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full flex items-center justify-center font-bold text-xl uppercase ${
          isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400'
        }`}>
          {name.charAt(0)}
        </div>
      )}
    </div>
    <h3 className="font-bold text-slate-800 text-[13px] mb-1 leading-tight">{name}</h3>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
      {count} {count === 1 ? 'TEACHER' : 'TEACHERS'}
    </p>
  </button>
)

export default function TeachersDirectory() {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading]   = useState(true)
  const [editing, setEditing]   = useState(null)
  const [editData, setEditData] = useState({})
  const [selectedDept, setSelectedDept] = useState(null)

  useEffect(() => {
    api.get('/admin/teachers').then(r => setTeachers(r.data)).finally(() => setLoading(false))
  }, [])

  const deptStats = ALL_DEPARTMENTS.map(d => ({
    name: d,
    count: teachers.filter(t => t.subject === d).length
  }))

  const filteredTeachers = selectedDept 
    ? teachers.filter(t => t.subject === selectedDept)
    : teachers

  const startEdit = (t) => {
    setEditing(t._id)
    setEditData({
      assignedClass: t.assignedClass || '',
      isClassTeacher: t.isClassTeacher || false,
      isTutor: t.isTutor || false
    })
  }

  const saveAssignment = async (id) => {
    try {
      const { data } = await api.put(`/admin/assign-class/${id}`, editData)
      setTeachers(ts => ts.map(t => t._id === id ? { ...t, ...data } : t))
      setEditing(null)
      toast.success('Updated successfully')
    } catch { toast.error('Failed to save') }
  }

  const deleteTeacher = async (id) => {
    if (!confirm('Remove this teacher?')) return
    try {
      await api.delete(`/admin/staff/${id}`)
      setTeachers(ts => ts.filter(t => t._id !== id))
      toast.success('Teacher removed')
    } catch { toast.error('Failed to remove') }
  }

  if (loading) return (
    <div className="p-20 flex flex-col items-center justify-center text-slate-400">
      <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-[10px] uppercase">Loading Directory</p>
    </div>
  )

  return (
    <div className="p-10 lg:p-16 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header with Right-Side Back Button */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-1">Teachers Directory</h1>
          <p className="text-slate-500 font-medium">{teachers.length} academic professionals registered</p>
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

      {/* Department Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-16">
        {deptStats.map((d, idx) => (
          <div key={d.name} style={{ animationDelay: `${idx * 40}ms` }} className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-400">
            <DepartmentCard 
              name={d.name} 
              count={d.count} 
              isActive={selectedDept === d.name}
              onClick={() => setSelectedDept(selectedDept === d.name ? null : d.name)}
            />
          </div>
        ))}
      </div>

      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {selectedDept ? `${selectedDept} Department` : 'All Departments'}
          </h2>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-bold">
            {filteredTeachers.length} profiles
          </span>
        </div>
        {selectedDept && (
          <button onClick={() => setSelectedDept(null)} className="text-slate-400 hover:text-slate-900 font-bold text-[11px] uppercase tracking-wider">
            SHOW ALL
          </button>
        )}
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/30">
                {['SL.', 'TEACHER ID', 'NAME', 'DESIGNATION / DEPT', 'CLASS', 'CLASS TEACHER', 'TUTOR', 'ACTIONS'].map(h => (
                  <th key={h} className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeachers.map((t, i) => (
                <tr key={t._id} className="group hover:bg-slate-50/20 transition-all">
                  <td className="px-6 py-6 text-slate-400 font-medium text-sm">{i + 1}</td>
                  <td className="px-6 py-6">
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-tight">
                      {t.employeeId}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {t.name.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-900">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-slate-900">{t.designation || 'HOD'}</span>
                      <span className="text-[11px] font-medium text-slate-400">{t.subject || 'Maths'}</span>
                    </div>
                  </td>

                  {editing === t._id ? (
                    <>
                      <td className="px-6 py-6">
                        <select className="bg-white border border-slate-200 rounded-xl text-xs font-bold p-2 w-28 outline-none focus:border-slate-400"
                          value={editData.assignedClass}
                          onChange={e => setEditData(d => ({ ...d, assignedClass: e.target.value }))}>
                          <option value="">None</option>
                          <option value="11">Class 11</option>
                          <option value="12">Class 12</option>
                        </select>
                      </td>
                      <td className="px-6 py-6">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-slate-900" checked={editData.isClassTeacher}
                          onChange={e => setEditData(d => ({ ...d, isClassTeacher: e.target.checked }))} />
                      </td>
                      <td className="px-6 py-6">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-slate-900" checked={editData.isTutor}
                          onChange={e => setEditData(d => ({ ...d, isTutor: e.target.checked }))} />
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-2">
                          <button onClick={() => saveAssignment(t._id)} className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-black transition-all">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditing(null)} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-6">
                        {t.assignedClass ? <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase">Class {t.assignedClass}</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-6">
                        {t.isClassTeacher ? <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-tight">Yes</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-6">
                        {t.isTutor ? <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-tight">Yes</span> : <span className="text-slate-200">—</span>}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => startEdit(t)} className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 rounded-xl hover:border-slate-800 hover:text-slate-900 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteTeacher(t._id)} className="w-10 h-10 flex items-center justify-center border border-slate-200 text-slate-500 rounded-xl hover:border-rose-300 hover:text-rose-600 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
