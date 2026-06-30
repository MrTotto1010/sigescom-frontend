import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { requestPasswordReset } from '../../services/authService'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    try {
      await requestPasswordReset(email)
      setMessage('Código generado correctamente. Revise la base de datos o el medio configurado.')
    } catch {
      setMessage('No se pudo generar el código de recuperación.')
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-3xl font-bold text-sky-600">
          Recuperar contraseña
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <button className="w-full rounded-xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600">
            Solicitar código
          </button>
        </form>

        <button
          onClick={() => navigate('/reset-password')}
          className="mt-5 w-full text-sm font-semibold text-sky-600"
        >
          Ya tengo un código
        </button>

        <button
          onClick={() => navigate('/')}
          className="mt-3 w-full text-sm font-semibold text-slate-500"
        >
          Volver al login
        </button>

        {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
      </section>
    </main>
  )
}

export default ForgotPassword