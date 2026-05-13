import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Auth
import Login    from './pages/auth/Login'
import Signup   from './pages/auth/Signup'

// Admin
import AdminLayout        from './pages/admin/AdminLayout'
import AdminDashboard     from './pages/admin/Dashboard'
import AdminCreate        from './pages/admin/Create'
import AdminAnnouncement  from './pages/admin/Announcement'
import TeachersDirectory  from './pages/admin/TeachersDirectory'
import StudentDirectory   from './pages/admin/StudentDirectory'
import AdminLeaderboard   from './pages/admin/Leaderboard'
import StudentProfile     from './pages/admin/StudentProfile'

// Teacher
import TeacherLayout     from './pages/teacher/TeacherLayout'
import TeacherDashboard  from './pages/teacher/Dashboard'
import MyClass           from './pages/teacher/MyClass'
import AttendancePage    from './pages/teacher/Attendance'
import MarksEntry        from './pages/teacher/MarksEntry'
import TeacherLeaderboard from './pages/teacher/Leaderboard'

// Student
import StudentLayout    from './pages/student/StudentLayout'
import StudentDashboard from './pages/student/Dashboard'
import StudentMarks     from './pages/student/Marks'
import StudentAttendance from './pages/student/Attendance'
import StudentLearn from './pages/student/Learn'
import StudentTimetable from './pages/student/Timetable'
import StudentCalendar from './pages/student/CollegeCalendar'

// Management
import MgmtLayout    from './pages/management/MgmtLayout'
import MgmtDashboard from './pages/management/Dashboard'
import FeesMgmt      from './pages/management/Fees'
import Timetable     from './pages/management/Timetable'
import CollegeCalendar from './pages/management/CollegeCalendar'
import SetFees       from './pages/management/SetFees'

const RoleRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

const RoleRedirect = () => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const map = { admin: '/admin', teacher: '/teacher', student: '/student', management: '/management' }
  return <Navigate to={map[user.role] || '/login'} replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/"       element={<RoleRedirect />} />

          {/* Admin */}
          <Route path="/admin" element={
            <RoleRoute allowedRoles={['admin']}>
              <AdminLayout />
            </RoleRoute>
          }>
            <Route index            element={<AdminDashboard />} />
            <Route path="create"    element={<AdminCreate />} />
            <Route path="announcement" element={<AdminAnnouncement />} />
            <Route path="teachers"  element={<TeachersDirectory />} />
            <Route path="students"  element={<StudentDirectory />} />
            <Route path="leaderboard" element={<AdminLeaderboard />} />
            <Route path="student/:id" element={<StudentProfile />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={
            <RoleRoute allowedRoles={['teacher']}>
              <TeacherLayout />
            </RoleRoute>
          }>
            <Route index              element={<TeacherDashboard />} />
            <Route path="my-class"    element={<MyClass />} />
            <Route path="attendance"  element={<AttendancePage />} />
            <Route path="marks"       element={<MarksEntry />} />
            <Route path="leaderboard" element={<TeacherLeaderboard />} />
            <Route path="announcement" element={<AdminAnnouncement />} />
            <Route path="student/:id" element={<StudentProfile />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={
            <RoleRoute allowedRoles={['student']}>
              <StudentLayout />
            </RoleRoute>
          }>
            <Route index             element={<StudentDashboard />} />
            <Route path="marks"      element={<StudentMarks />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="learn"      element={<StudentLearn />} />
            <Route path="timetable"  element={<StudentTimetable />} />
            <Route path="calendar"   element={<StudentCalendar />} />
          </Route>

          {/* Management */}
          <Route path="/management" element={
            <RoleRoute allowedRoles={['management']}>
              <MgmtLayout />
            </RoleRoute>
          }>
            <Route index              element={<MgmtDashboard />} />
            <Route path="fees"        element={<FeesMgmt />} />
            <Route path="timetable"   element={<Timetable />} />
            <Route path="calendar"    element={<CollegeCalendar />} />
            <Route path="set-fees"    element={<SetFees />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
