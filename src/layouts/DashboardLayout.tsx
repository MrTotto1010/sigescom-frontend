import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout