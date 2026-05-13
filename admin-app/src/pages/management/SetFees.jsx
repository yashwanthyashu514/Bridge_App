import { useState, useEffect } from 'react'
import api from '../../api'
import toast from 'react-hot-toast'
import { Settings, Save, Info } from 'lucide-react'

export default function SetFees() {
  const [feesData, setFeesData] = useState({
    class11: 0,
    class12: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you'd fetch current settings
    setLoading(false)
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await api.post('/management/set-fees', feesData)
      toast.success('College fees updated for all students!')
    } catch (err) {
      toast.error('Failed to update fees')
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Set College Fees</h1>
        <p className="text-gray-500 mt-1">Configure the base tuition fees for each academic year</p>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl mb-8 border border-blue-100">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Updating these values will reset the <strong>Total Fees</strong> for all students in the respective classes. Use with caution.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Class 11 Annual Fees (₹)</label>
              <input 
                type="number" 
                className="input py-3 text-lg font-bold" 
                placeholder="e.g. 50000"
                value={feesData.class11}
                onChange={e => setFeesData(f => ({...f, class11: e.target.value}))}
              />
            </div>
            <div>
              <label className="label">Class 12 Annual Fees (₹)</label>
              <input 
                type="number" 
                className="input py-3 text-lg font-bold" 
                placeholder="e.g. 55000"
                value={feesData.class12}
                onChange={e => setFeesData(f => ({...f, class12: e.target.value}))}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center py-4 text-lg">
            <Save className="w-5 h-5" />
            Apply Fees to All Students
          </button>
        </form>
      </div>
    </div>
  )
}
