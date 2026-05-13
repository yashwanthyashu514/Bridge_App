import { Outlet } from 'react-router-dom'

export default function StudentLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <main className="w-full h-full min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
