import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import {
  approveRoleChange,
  getRoleChangeRequests,
  getRoles,
  rejectRoleChange,
  requestRoleChange,
  type Role,
  type RoleChangeRequest,
} from '../../services/roleService'

function Roles() {
  const { user, hasRole } = useAuth()

  const [roles, setRoles] = useState<Role[]>([])
  const [requests, setRequests] = useState<RoleChangeRequest[]>([])
  const [selectedRole, setSelectedRole] = useState('')
  const [justification, setJustification] = useState('')
  const [message, setMessage] = useState('')

  const isAdmin = hasRole('ADMINISTRADOR')

  const loadData = async () => {
    const rolesData = await getRoles()
    setRoles(rolesData)

    if (isAdmin) {
      const requestsData = await getRoleChangeRequests()
      setRequests(requestsData)
    }
  }

  useEffect(() => {
    loadData()
  }, [isAdmin])

  const handleRequestRole = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user || !selectedRole) return

    try {
      const response = await requestRoleChange(
        user.id_usuario,
        Number(selectedRole),
        justification,
      )

      if (response.success) {
        setMessage('Solicitud de cambio de rol enviada correctamente.')
        setSelectedRole('')
        setJustification('')
      } else {
        setMessage(response.message || 'No se pudo enviar la solicitud.')
      }
    } catch {
      setMessage('No se pudo enviar la solicitud. Verifique si ya tiene una pendiente.')
    }
  }

  const handleApprove = async (id: number) => {
    await approveRoleChange(id)
    await loadData()
  }

  const handleReject = async (id: number) => {
    await rejectRoleChange(id)
    await loadData()
  }

  if (!isAdmin) {
    return (
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold text-sky-600">
          Solicitar cambio de rol
        </h1>

        <form
          onSubmit={handleRequestRole}
          className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rol solicitado
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            >
              <option value="">Seleccione un rol</option>
              {roles
                .filter(
                  (role) =>
                    role.nombre !== 'ADMINISTRADOR' &&
                    !user?.roles.includes(role.nombre),
                )
                .map((role) => (
                  <option key={role.id_rol} value={role.id_rol}>
                    {role.nombre}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Justificación
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              rows={5}
              required
            />
          </div>

          <button className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
            Enviar solicitud
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
      </section>
    )
  }

  return (
    <section>
      <h1 className="text-3xl font-bold text-sky-600">
        Solicitudes de cambio de rol
      </h1>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full min-w-900px text-left">
          <thead className="bg-sky-50 text-slate-700">
            <tr>
              <th className="px-5 py-4">Usuario</th>
              <th className="px-5 py-4">Rol solicitado</th>
              <th className="px-5 py-4">Justificación</th>
              <th className="px-5 py-4">Fecha</th>
              <th className="px-5 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-6 text-center text-slate-500">
                  No hay solicitudes pendientes.
                </td>
              </tr>
            )}

            {requests.map((request) => (
              <tr key={request.id_solicitud_cambio} className="border-t border-slate-100">
                <td className="px-5 py-4">{request.nombre_completo}</td>
                <td className="px-5 py-4">{request.rol_solicitado}</td>
                <td className="px-5 py-4">{request.justificacion}</td>
                <td className="px-5 py-4">
                  {new Date(request.fecha_solicitud).toLocaleDateString('es-CR')}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(request.id_solicitud_cambio)}
                      className="rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600"
                    >
                      Aprobar
                    </button>

                    <button
                      onClick={() => handleReject(request.id_solicitud_cambio)}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Roles