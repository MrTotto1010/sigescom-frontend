import { NavLink } from 'react-router-dom'

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-4 py-3 text-sm font-medium transition md:rounded-none md:px-6 md:py-4 ${
      isActive
        ? 'bg-sky-900 text-white'
        : 'text-sky-100 hover:bg-sky-800'
    }`

  return (
    <aside className="bg-sky-700 text-white md:min-h-screen md:w-64 md:shrink-0">
      <div className="border-b border-sky-600 p-4 md:p-6">
        <h1 className="text-xl font-bold md:text-2xl">SIGESCOM</h1>
      </div>

      <nav className="flex gap-2 overflow-x-auto p-3 md:mt-4 md:flex-col md:gap-0 md:overflow-visible md:p-0">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/solicitudes" className={linkClass}>
          Solicitudes
        </NavLink>

        <NavLink to="/roles" className={linkClass}>
          Roles
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar