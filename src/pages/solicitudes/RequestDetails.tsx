import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  addRequestDetail,
  approveRequest,
  getAdminPendingRequests,
  getPendingRequests,
  getRequestDetails,
  getRequestsByUser,
  rejectRequest,
  submitRequest,
  type Request,
  type RequestDetail,
} from '../../services/requestService'

function RequestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, hasRole } = useAuth()

  const requestId = Number(id)

  const [request, setRequest] = useState<Request | null>(null)
  const [details, setDetails] = useState<RequestDetail[]>([])
  const [type, setType] = useState('PRODUCTO')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [unitPrice, setUnitPrice] = useState('')
  const [provider, setProvider] = useState('')
  const [message, setMessage] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const isDraft = request?.estado === 'BORRADOR'

  const canApprove =
    (hasRole('APROBADOR') && request?.estado === 'PENDIENTE') ||
    (hasRole('ADMINISTRADOR') && request?.estado === 'PENDIENTE_ADMIN')

  const loadData = async () => {
    if (!user) return

    const [ownRequests, pendingRequests, adminPendingRequests, detailsData] =
      await Promise.all([
        getRequestsByUser(user.id_usuario),
        hasRole('APROBADOR') ? getPendingRequests() : Promise.resolve([]),
        hasRole('ADMINISTRADOR') ? getAdminPendingRequests() : Promise.resolve([]),
        getRequestDetails(requestId),
      ])

    const currentRequest =
      ownRequests.find((item) => item.id_solicitud === requestId) ||
      pendingRequests.find((item) => item.id_solicitud === requestId) ||
      adminPendingRequests.find((item) => item.id_solicitud === requestId) ||
      null

    setRequest(currentRequest)
    setDetails(detailsData)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddDetail = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!isDraft) return

    await addRequestDetail({
      id_solicitud: requestId,
      tipo: type,
      descripcion: description,
      cantidad: quantity,
      precio_unitario: Number(unitPrice),
      proveedor: provider,
    })

    setDescription('')
    setQuantity(1)
    setUnitPrice('')
    setProvider('')
    setMessage('Detalle agregado correctamente.')
    await loadData()
  }

  const handleSubmitRequest = async () => {
    if (!isDraft) return

    if (details.length === 0) {
      setMessage('Debe agregar al menos un detalle antes de enviar.')
      return
    }

    await submitRequest(requestId)
    navigate('/solicitudes')
  }

  const handleApprove = async () => {
    if (!user) return

    await approveRequest(requestId, user.id_usuario)
    navigate('/solicitudes')
  }

  const handleReject = async () => {
    if (!user) return

    if (rejectReason.trim() === '') {
      setMessage('Debe indicar un motivo para rechazar la solicitud.')
      return
    }

    await rejectRequest(requestId, user.id_usuario, rejectReason)
    navigate('/solicitudes')
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sky-600">
            Detalles de la solicitud
          </h1>
          <p className="text-slate-500">
            Estado actual: {request?.estado || 'Cargando...'}
          </p>
        </div>

        <button
          onClick={() => navigate('/solicitudes')}
          className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Volver
        </button>
      </div>

      {request && (
        <div className="mb-6 rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-slate-800">
            Solicitud #{request.numero_solicitud}
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Prioridad</p>
              <p className="font-semibold">{request.prioridad}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Subtotal</p>
              <p className="font-semibold">{formatCurrency(request.subtotal)}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="font-semibold">{formatCurrency(request.total)}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-slate-500">Justificación</p>
            <p className="mt-1 text-slate-700">
              {request.justificacion || 'Sin justificación registrada.'}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isDraft && (
          <form
            onSubmit={handleAddDetail}
            className="space-y-5 rounded-2xl bg-white p-6 shadow"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              >
                <option value="PRODUCTO">Producto</option>
                <option value="SERVICIO">Servicio</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Descripción
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Laptop Dell Latitude"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Precio unitario (₡)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={unitPrice}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setUnitPrice(value)
                  }}
                  placeholder="Ej. 150000"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Proveedor
              </label>
              <input
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="Ej. Intelec"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-xl bg-sky-500 px-5 py-3 font-semibold text-white hover:bg-sky-600">
                Agregar detalle
              </button>

              <button
                type="button"
                onClick={() => navigate('/solicitudes')}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Guardar borrador y salir
              </button>
            </div>
          </form>
        )}

        {!isDraft && (
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="text-xl font-bold text-slate-800">
              Revisión de solicitud
            </h2>
            <p className="mt-2 text-slate-500">
              Revise los detalles antes de aprobar o rechazar.
            </p>

            {canApprove && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleApprove}
                  className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600"
                >
                  Aprobar
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  className="rounded-xl bg-red-500 px-5 py-3 font-semibold text-white hover:bg-red-600"
                >
                  Rechazar
                </button>
              </div>
            )}
          </div>
        )}

        <aside className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-slate-800">
            Detalles agregados
          </h2>

          {details.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              Aún no hay detalles registrados.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {details.map((detail) => (
                <div
                  key={detail.id_detalle}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-800">
                    {detail.descripcion}
                  </p>
                  <p className="text-sm text-slate-500">
                    {detail.tipo} · Cantidad: {detail.cantidad}
                  </p>
                  <p className="text-sm text-slate-500">
                    Proveedor: {detail.proveedor || 'No indicado'}
                  </p>
                  <p className="text-sm font-semibold text-sky-700">
                    {formatCurrency(detail.total_linea)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {isDraft && (
            <button
              onClick={handleSubmitRequest}
              className="mt-6 w-full rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600"
            >
              Enviar solicitud
            </button>
          )}
        </aside>
      </div>

      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-slate-800">
              Rechazar solicitud
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Indique el motivo por el cual rechaza esta solicitud.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3"
              rows={4}
              placeholder="Motivo del rechazo"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleReject}
                className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default RequestDetails