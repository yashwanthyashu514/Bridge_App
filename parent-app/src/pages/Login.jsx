import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Phone, ArrowRight } from 'lucide-react'

export default function Login() {
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    if (mobile.length < 10) return toast.error('Enter valid mobile number')
    setLoading(true)
    try {
      await login(mobile)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your mobile number.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bridge App</h1>
          <p className="text-primary-100">Parent Portal Login</p>
        </div>

        <div className="card p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Access Student Profile</h2>
          <form onSubmit={handle} className="space-y-6">
            <div>
              <label className="label">Registered Mobile Number</label>
              <div className="relative">
                <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="tel" 
                  className="input pl-10 py-3" 
                  placeholder="Enter 10-digit number"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Use the mobile number provided during registration.</p>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
              {loading ? 'Logging in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
