import { useState } from 'react'
import { login } from '../../services/authService'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await login({
        correo: email,
        password_hash: password,
      })

      if (response.success && response.id_usuario && response.nombre) {
        loginUser({
          id_usuario: response.id_usuario,
          nombre: response.nombre,
          roles: response.roles || [],
        })

        navigate('/dashboard')
      } else {
        setMessage(response.message || 'Credenciales incorrectas')
      }
    } catch {
      setMessage('Error al iniciar sesión')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-sky-600">
          SIGESCOM
        </h1>

        <p className="mt-2 text-center text-slate-500">
          Iniciar sesión
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              type="email"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            Entrar
          </button>
        </form>

        <button
          onClick={() => navigate('/forgot-password')}
          className="mt-5 w-full text-center text-sm font-semibold text-slate-500"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <button
          onClick={() => navigate('/register')}
          className="mt-3 w-full text-center text-sm font-semibold text-sky-600"
        >
          ¿Eres nuevo? Crea una cuenta
        </button>

        {message && (
          <p className="mt-5 text-center text-sm text-slate-600">
            {message}
          </p>
        )}
      </section>
    </main>
  )
}

export default Login