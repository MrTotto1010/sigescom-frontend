import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { createRequest } from '../../services/requestService'

function NewRequest() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [priority, setPriority] = useState('MEDIA')
  const [justification, setJustification] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user) return

    try {
      const response = await createRequest({
        id_usuario: user.id_usuario,
        prioridad: priority,
        justificacion: justification,
      })

      if (response.success && response.id_solicitud) {
        navigate(`/solicitudes/${response.id_solicitud}/detalle`)
      } else {
        setMessage('No se pudo crear la solicitud.')
      }
    } catch {
      setMessage('Error al crear la solicitud.')
    }
  }

  return (
    <section className="max-w-3xl">
      <h1 className="text-3xl font-bold text-sky-600">
        Nueva solicitud
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Prioridad
          </label>
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Justificación
          </label>
          <textarea
            value={justification}
            onChange={(event) => setJustification(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            rows={5}
            required
          />
        </div>

        <button className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
          Crear solicitud
        </button>

        {message && <p className="text-sm text-red-500">{message}</p>}
      </form>
    </section>
  )
}

export default NewRequest