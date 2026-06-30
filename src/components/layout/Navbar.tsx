import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/')
  }

  return (
    <header className="flex flex-col gap-3 bg-white px-4 py-4 shadow md:h-20 md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
      <h2 className="text-lg font-semibold text-slate-800 md:text-xl">
        Sistema de Gestión de Compras
      </h2>

      <div className="flex items-center justify-between gap-3 md:justify-end md:gap-5">
        <span className="text-sm font-medium text-slate-700 md:text-base">
          {user?.nombre}
        </span>

        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-600 md:px-4"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}

export default Navbar