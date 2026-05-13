import { useEffect, useState } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'
import { IndianRupee, Search, CheckCircle } from 'lucide-react'

export default function FeesMgmt() {
  const [fees, setFees]     = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying]   = useState({}) // { [id]: amount }
  const [filter, setFilter]   = useState({ class: '', search: '' })

  useEffect(() => {
    loadFees()
  }, [])

  const loadFees = async () => {
    try {
      const { data } = await api.get('/management/fees')
      setFees(data)
    } catch {
      toast.error('Failed to load fees data')
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async (studentId) => {
    const amount = paying[studentId]
    if (!amount || amount <= 0) return toast.error('Enter valid amount')

    try {
      await api.put(`/management/fees/${studentId}/pay`, { amount })
      toast.success('Payment recorded!')
      setPaying(prev => ({ ...prev, [studentId]: '' }))
      loadFees() // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed')
    }
  }

  const filtered = fees.filter(f => {
    const search = filter.search.toLowerCase()
    const student = f.studentId || {}
    return (
      (!filter.class || student.class === filter.class) &&
      (!search || student.name?.toLowerCase().includes(search) ||
        student.studentId?.toLowerCase().includes(search) ||
        student.regNumber?.toLowerCase().includes(search))
    )
  })

  if (loading) return <div className="p-8 text-gray-500">Loading fees records...</div>

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Fees Management</h1>
          <p className="text-gray-500 mt-1">Track payments and manage student balances</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9 w-64" placeholder="Search student name or ID..."
              value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
          </div>
          <select className="input w-32" value={filter.class} onChange={e => setFilter(f => ({ ...f, class: e.target.value }))}>
            <option value="">All Classes</option>
            <option value="11">Class 11</option>
            <option value="12">Class 12</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Sl.No','Student ID','Name','Class','Total Fees','Paid','Balance','Payment Input','Action'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((f, i) => {
                const balance = f.totalFees - f.paid
                return (
                  <tr key={f._id} className="hover:bg-gray-50">
                    <td className="table-td text-gray-400">{i + 1}</td>
                    <td className="table-td font-mono text-xs">{f.studentId?.studentId}</td>
                    <td className="table-td font-medium text-gray-900">{f.studentId?.name}</td>
                    <td className="table-td"><span className="badge bg-primary-50 text-primary-700">Class {f.studentId?.class}</span></td>
                    <td className="table-td font-semibold text-gray-800">₹{f.totalFees.toLocaleString()}</td>
                    <td className="table-td text-green-600 font-medium">₹{f.paid.toLocaleString()}</td>
                    <td className="table-td">
                      <span className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{balance.toLocaleString()}
                      </span>
                    </td>
                    <td className="table-td">
                      <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg px-2 w-32 focus-within:ring-2 focus-within:ring-primary-500">
                        <span className="text-gray-400 text-xs">₹</span>
                        <input 
                          type="number" 
                          className="bg-transparent border-none focus:ring-0 w-full text-sm p-1"
                          placeholder="Amount"
                          value={paying[f.studentId?._id] || ''}
                          onChange={e => setPaying(p => ({ ...p, [f.studentId?._id]: e.target.value }))}
                        />
                      </div>
                    </td>
                    <td className="table-td">
                      <button 
                        onClick={() => handlePay(f.studentId?._id)}
                        className="btn-primary py-1.5 px-4 text-xs">
                        Mark Paid
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="table-td text-center text-gray-400 py-12">No matching fee records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
