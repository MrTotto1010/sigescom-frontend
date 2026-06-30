import { useAuth } from '../../contexts/AuthContext'

function Dashboard() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <h1 className="text-4xl font-bold text-sky-600">
        Bienvenido {user?.nombre}
      </h1>
    </main>
  )
}

export default Dashboard