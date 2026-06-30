import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../../services/authService'
import {
  getDepartments,
  getPositionsByDepartment,
  type Department,
  type Position,
} from '../../services/userService'

function Register() {
  const navigate = useNavigate()

  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])

  const [departmentId, setDepartmentId] = useState('')
  const [positionId, setPositionId] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getDepartments()
      setDepartments(data)
    }

    loadDepartments()
  }, [])

  useEffect(() => {
    const loadPositions = async () => {
      if (!departmentId) return

      const data = await getPositionsByDepartment(Number(departmentId))
      setPositions(data)
      setPositionId('')
    }

    loadPositions()
  }, [departmentId])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.')
      return
    }

    try {
      const response = await register({
        id_departamento: Number(departmentId),
        id_puesto: Number(positionId),
        nombre_completo: fullName,
        correo: email,
        password_hash: password,
        telefono: phone,
      })

      if (response.success) {
        navigate('/')
      } else {
        setMessage(response.message || 'No se pudo registrar el usuario.')
      }
    } catch {
      setMessage('Error al registrar el usuario.')
    }
  }

  return (
    <main className="min-h-screen bg-sky-50 px-4 py-8">
      <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-center text-3xl font-bold text-sky-600">
          Crear cuenta
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono"
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          />

          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            <option value="">Seleccione un departamento</option>
            {departments.map((department) => (
              <option
                key={department.id_departamento}
                value={department.id_departamento}
              >
                {department.nombre}
              </option>
            ))}
          </select>

          <select
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            required
          >
            <option value="">Seleccione un puesto</option>
            {positions.map((position) => (
              <option key={position.id_puesto} value={position.id_puesto}>
                {position.nombre}
              </option>
            ))}
          </select>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
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
            Registrarme
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}

        <button
          onClick={() => navigate('/')}
          className="mt-5 w-full text-center text-sm font-semibold text-sky-600"
        >
          Ya tengo cuenta
        </button>
      </section>
    </main>
  )
}

export default Register