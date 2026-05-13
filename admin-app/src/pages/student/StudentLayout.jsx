import { Outlet } from 'react-router-dom'

export default function StudentLayout() {
  return (
    <div className="h-screen bg-slate-50/50 overflow-hidden">
      <main className="w-full h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
