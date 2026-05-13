import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { LayoutDashboard, IndianRupee, Table, Calendar, Settings } from 'lucide-react'

const links = [
  { to: '/management',            label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/management/fees',       label: 'Fees Management', icon: IndianRupee },
  { to: '/management/timetable',  label: 'Timetable',      icon: Table },
  { to: '/management/calendar',   label: 'College Calendar', icon: Calendar },
  { to: '/management/set-fees',   label: 'Set College Fees', icon: Settings }
]

export default function MgmtLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar links={links} />
      <main className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
