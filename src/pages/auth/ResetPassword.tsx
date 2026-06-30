import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword } from '../../services/authService'

function ResetPassword() {
  const navigate = useNavigate()

  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    try {
      await changePassword(code, password)
      setMessage('Contraseña actualizada correctamente.')
      setTimeout(() => navigate('/'), 1000)
    } catch {
      setMessage('No se pudo cambiar la contraseña.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-sky-600">
          Cambiar contraseña
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Código de recuperación"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <button className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600">
            Cambiar contraseña
          </button>
        </form>

        <button
          onClick={() => navigate('/')}
          className="mt-5 w-full text-sm font-semibold text-sky-600"
        >
          Volver al login
        </button>

        {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
      </section>
    </main>
  )
}

export default ResetPassword