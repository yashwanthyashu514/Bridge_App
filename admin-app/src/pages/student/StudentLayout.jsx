import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  GraduationCap, 
  Clock, 
  CalendarDays 
} from 'lucide-react'

const links = [
  { to: '/student',              label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/student/marks',        label: 'My Marks',     icon: FileText },
  { to: '/student/attendance',   label: 'Attendance',   icon: UserCheck },
  { to: '/student/timetable',    label: 'Timetable',    icon: Clock },
  { to: '/student/calendar',     label: 'Calendar',     icon: CalendarDays },
  { to: '/student/learn',        label: 'Learn',        icon: GraduationCap }
]

export default function StudentLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar links={links} />
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
