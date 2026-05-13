import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api'
import toast from 'react-hot-toast'
import { GraduationCap, CheckCircle, Clock } from 'lucide-react'

export default function Signup() {
  const [form, setForm] = useState({
    name: '', regNumber: '', class: '11', section: 'A',
    studentMobile: '', studentWhatsapp: '',
    parentMobile: '', parentWhatsapp: '',
    email: '', password: '', gender: ''
  })
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [studentId, setStudentId] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handle = async (e) => {
    e.preventDefault()
    if (!form.gender) return toast.error('Please select gender')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/signup', form)
      setStudentId(data.studentId)
      setSubmitted(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="card p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Submitted!</h2>
        <p className="text-gray-600 mb-4">
          Your account is <strong>pending approval</strong> from your class teacher.
          You will be able to login once approved.
        </p>
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-primary-600 font-medium uppercase tracking-wide mb-1">Your Student ID</p>
          <p className="text-2xl font-bold text-primary-700">{studentId}</p>
          <p className="text-xs text-primary-500 mt-1">Keep this safe for future reference</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-3 mb-4">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Your class teacher will review and approve your account shortly.</span>
        </div>
        <Link to="/login" className="btn-primary w-full justify-center">
          Back to Login
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-lg mb-3">
            <GraduationCap className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Registration</h1>
          <p className="text-primary-200 text-sm mt-1">PU College Bridge App</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handle} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Personal Details</h3>
            </div>

            <div>
              <label className="label">Full Name *</label>
              <input className="input" placeholder="As per records" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>

            <div>
              <label className="label">Registration Number *</label>
              <input className="input" placeholder="College reg number" value={form.regNumber}
                onChange={e => set('regNumber', e.target.value)} required />
            </div>

            <div>
              <label className="label">Class *</label>
              <select className="input" value={form.class} onChange={e => set('class', e.target.value)}>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div>
              <label className="label">Section *</label>
              <select className="input" value={form.section} onChange={e => set('section', e.target.value)}>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div>
              <label className="label">Gender *</label>
              <select className="input" value={form.gender} onChange={e => set('gender', e.target.value)} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Details</h3>
            </div>

            <div>
              <label className="label">Student Mobile</label>
              <input className="input" type="tel" placeholder="10-digit number" value={form.studentMobile}
                onChange={e => set('studentMobile', e.target.value)} />
            </div>

            <div>
              <label className="label">Student WhatsApp</label>
              <input className="input" type="tel" placeholder="WhatsApp number" value={form.studentWhatsapp}
                onChange={e => set('studentWhatsapp', e.target.value)} />
            </div>

            <div>
              <label className="label">Parent Mobile *</label>
              <input className="input" type="tel" placeholder="Parent's mobile" value={form.parentMobile}
                onChange={e => set('parentMobile', e.target.value)} required />
            </div>

            <div>
              <label className="label">Parent WhatsApp *</label>
              <input className="input" type="tel" placeholder="Parent's WhatsApp" value={form.parentWhatsapp}
                onChange={e => set('parentWhatsapp', e.target.value)} required />
            </div>

            <div className="md:col-span-2 mt-2">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Login Credentials</h3>
            </div>

            <div>
              <label className="label">Student Email *</label>
              <input className="input" type="email" placeholder="Your email address" value={form.email}
                onChange={e => set('email', e.target.value)} required />
            </div>

            <div>
              <label className="label">Password *</label>
              <input className="input" type="password" placeholder="Create a password" value={form.password}
                onChange={e => set('password', e.target.value)} required minLength={6} />
            </div>

            <div className="md:col-span-2 mt-2">
              <button type="submit" className="btn-primary w-full justify-center py-3" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>

            <div className="md:col-span-2 text-center">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <Link to="/login" className="text-primary-600 font-medium hover:underline text-sm">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
