import { useEffect, useState } from 'react'
import api from '../../api'
import { IndianRupee, Users, Calendar, AlertCircle } from 'lucide-react'

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="card p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
    {sub && <p className="text-xs text-gray-400 mt-2">{sub}</p>}
  </div>
)

export default function MgmtDashboard() {
  const [stats, setStats] = useState({ 
    totalStudents: 0, 
    totalCollected: 0, 
    totalPending: 0,
    upcomingEvents: 0 
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, fRes, cRes] = await Promise.all([
          api.get('/admin/students?status=approved'),
          api.get('/management/fees'),
          api.get('/management/calendar')
        ])
        
        const totalPaid = fRes.data.reduce((acc, f) => acc + f.paid, 0)
        const totalFees = fRes.data.reduce((acc, f) => acc + f.totalFees, 0)

        setStats({
          totalStudents: sRes.data.length,
          totalCollected: totalPaid,
          totalPending: totalFees - totalPaid,
          upcomingEvents: cRes.data.length
        })
      } catch { /* toast.error('Dashboard load failed') */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Management Dashboard</h1>
        <p className="text-gray-500 mt-1">Financial and operational overview of PU College</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Students" value={stats.totalStudents} icon={Users} color="bg-primary-600" />
        <StatCard label="Collected Fees" value={`₹${stats.totalCollected.toLocaleString()}`} icon={IndianRupee} color="bg-emerald-600" />
        <StatCard label="Pending Balance" value={`₹${stats.totalPending.toLocaleString()}`} icon={AlertCircle} color="bg-red-500" />
        <StatCard label="College Events" value={stats.upcomingEvents} icon={Calendar} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Financial Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Daily Collection</span>
              <span className="text-sm font-bold text-emerald-600">₹0</span>
            </div>
            <p className="text-xs text-gray-400 text-center italic">Detailed financial reports coming soon</p>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Operational Status</h2>
          <div className="space-y-3">
             <div className="flex justify-between text-sm">
                <span className="text-gray-500">Academic Year</span>
                <span className="font-bold">2024-25</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-gray-500">Working Days (Monthly)</span>
                <span className="font-bold">24</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
