import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  getAdminPendingRequests,
  getPendingRequests,
  getRequestsByUser,
  searchRequestsByCode,
  type Request,
} from '../../services/requestService'

function Solicitudes() {
  const { user, hasRole } = useAuth()
  const navigate = useNavigate()

  const [ownRequests, setOwnRequests] = useState<Request[]>([])
  const [pendingRequests, setPendingRequests] = useState<Request[]>([])
  const [adminPendingRequests, setAdminPendingRequests] = useState<Request[]>([])
  const [auditRequests, setAuditRequests] = useState<Request[]>([])
  const [auditCode, setAuditCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [auditLoading, setAuditLoading] = useState(false)
  const [message, setMessage] = useState('')

  const isApprover = hasRole('APROBADOR')
  const isAuditor = hasRole('AUDITOR')
  const isAdmin = hasRole('ADMINISTRADOR')

  useEffect(() => {
    const loadRequests = async () => {
      if (!user) return

      try {
        const ownData = await getRequestsByUser(user.id_usuario)
        setOwnRequests(ownData)

        if (isApprover) {
          const pendingData = await getPendingRequests()
          setPendingRequests(pendingData)
        }

        if (isAdmin) {
          const adminPendingData = await getAdminPendingRequests()
          setAdminPendingRequests(adminPendingData)
        }
      } catch {
        setMessage('No se pudieron cargar las solicitudes.')
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [user, isApprover, isAdmin])

  const handleAuditSearch = async (event: React.FormEvent) => {
    event.preventDefault()

    if (auditCode.trim() === '') return

    try {
      setAuditLoading(true)
      const data = await searchRequestsByCode(auditCode.trim())
      setAuditRequests(data)
    } catch {
      setMessage('No se pudo realizar la búsqueda.')
    } finally {
      setAuditLoading(false)
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0,
    }).format(value)

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'BORRADOR':
        return 'bg-slate-100 text-slate-700'
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-700'
      case 'PENDIENTE_ADMIN':
        return 'bg-blue-100 text-blue-700'
      case 'APROBADA':
        return 'bg-green-100 text-green-700'
      case 'RECHAZADA':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getDecisionLabel = (request: Request) => {
    if (request.estado === 'APROBADA' || request.estado === 'RECHAZADA') {
      return request.usuario_decision || 'Sin registrar'
    }

    return '-'
  }

  const renderTable = (requests: Request[], emptyMessage: string) => (
    <div className="overflow-x-auto rounded-2xl bg-white shadow">
      <table className="w-full min-w-1100px text-left">
        <thead className="bg-sky-50 text-slate-700">
          <tr>
            <th className="px-5 py-4">Código</th>
            <th className="px-5 py-4">Fecha</th>
            <th className="px-5 py-4">Prioridad</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4">Decisión por</th>
            <th className="px-5 py-4">Subtotal</th>
            <th className="px-5 py-4">Impuesto</th>
            <th className="px-5 py-4">Total</th>
            <th className="px-5 py-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={9} className="px-5 py-6 text-center text-slate-500">
                Cargando solicitudes...
              </td>
            </tr>
          )}

          {!loading && requests.length === 0 && (
            <tr>
              <td colSpan={9} className="px-5 py-6 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!loading &&
            requests.map((request) => (
              <tr key={request.id_solicitud} className="border-t border-slate-100">
                <td className="px-5 py-4 font-semibold text-sky-700">
                  {request.numero_solicitud}
                </td>
                <td className="px-5 py-4">
                  {new Date(request.fecha_creacion).toLocaleDateString('es-CR')}
                </td>
                <td className="px-5 py-4">{request.prioridad}</td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                      request.estado,
                    )}`}
                  >
                    {request.estado}
                  </span>
                </td>
                <td className="px-5 py-4">{getDecisionLabel(request)}</td>
                <td className="px-5 py-4">{formatCurrency(request.subtotal)}</td>
                <td className="px-5 py-4">{formatCurrency(request.impuesto)}</td>
                <td className="px-5 py-4 font-semibold">
                  {formatCurrency(request.total)}
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() =>
                      navigate(`/solicitudes/${request.id_solicitud}/detalle`)
                    }
                    className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-200"
                  >
                    {request.estado === 'BORRADOR' ? 'Continuar' : 'Ver detalle'}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">Solicitudes</h1>
          <p className="text-slate-500">Consulta y gestiona solicitudes.</p>
        </div>

        <button
          onClick={() => navigate('/solicitudes/nueva')}
          className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600"
        >
          Nueva solicitud
        </button>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-bold text-slate-800">Mis solicitudes</h2>
        {renderTable(ownRequests, 'No tienes solicitudes registradas.')}
      </div>

      {isApprover && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Solicitudes pendientes de aprobación
          </h2>
          {renderTable(
            pendingRequests,
            'No hay solicitudes pendientes de aprobación.',
          )}
        </div>
      )}

      {isAdmin && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Solicitudes pendientes de aprobación administrativa
          </h2>
          {renderTable(
            adminPendingRequests,
            'No hay solicitudes pendientes de aprobación administrativa.',
          )}
        </div>
      )}

      {isAuditor && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Auditoría de solicitudes
          </h2>

          <form
            onSubmit={handleAuditSearch}
            className="mb-4 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow md:flex-row"
          >
            <input
              value={auditCode}
              onChange={(e) => setAuditCode(e.target.value)}
              placeholder="Buscar por código de solicitud"
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3"
            />

            <button className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
              Buscar
            </button>
          </form>

          {auditLoading ? (
            <p className="text-sm text-slate-500">Buscando solicitudes...</p>
          ) : (
            renderTable(auditRequests, 'No hay resultados para mostrar.')
          )}
        </div>
      )}

      {message && <p className="text-sm text-red-500">{message}</p>}
    </section>
  )
}

export default Solicitudes