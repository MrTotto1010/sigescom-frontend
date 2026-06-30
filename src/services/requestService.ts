import apiClient from '../api/apiClient'

export interface Request {
  id_solicitud: number
  numero_solicitud: string
  fecha_creacion: string
  prioridad: string
  estado: string
  subtotal: number
  impuesto: number
  total: number
  id_usuario_decision: number | null
  usuario_decision: string | null
  justificacion: string
  observaciones: string | null
}

export interface CreateRequestDto {
  id_usuario: number
  prioridad: string
  justificacion: string
}

export interface CreateRequestDetailDto {
  id_solicitud: number
  tipo: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  proveedor: string
}

export interface RequestDetail {
  id_detalle: number
  id_solicitud: number
  tipo: string
  descripcion: string
  cantidad: number
  precio_unitario: number
  proveedor: string
  total_linea: number
}

export const getRequestsByUser = async (id_usuario: number) => {
  const response = await apiClient.get('/solicitudes/listar', {
    params: { id_usuario },
  })

  return response.data.items as Request[]
}

export const searchRequestsByCode = async (codigo: string) => {
  const response = await apiClient.get('/solicitudes/buscar', {
    params: { codigo },
  })

  return response.data.items as Request[]
}

export const createRequest = async (data: CreateRequestDto) => {
  const response = await apiClient.post('/solicitudes/solicitudes', null, {
    params: data,
  })

  return response.data
}

export const addRequestDetail = async (data: CreateRequestDetailDto) => {
  const response = await apiClient.post('/solicitudes/detalle', null, {
    params: data,
  })

  return response.data
}

export const submitRequest = async (id_solicitud: number) => {
  const response = await apiClient.post('/solicitudes/enviar', null, {
    params: { id_solicitud },
  })

  return response.data
}

export const getRequestDetails = async (id_solicitud: number) => {
  const response = await apiClient.get('/solicitudes/detalle/listar', {
    params: { id_solicitud },
  })

  return response.data.items as RequestDetail[]
}

export const getPendingRequests = async () => {
  const response = await apiClient.get('/solicitudes/pendientes')

  return response.data.items as Request[]
}

export const approveRequest = async (id_solicitud: number, id_aprobador: number) => {
  const response = await apiClient.post('/solicitudes/aprobar', null, {
    params: { id_solicitud, id_aprobador },
  })

  return response.data
}

export const rejectRequest = async (
  id_solicitud: number,
  id_aprobador: number,
  observacion: string,
) => {
  const response = await apiClient.post('/solicitudes/rechazar', null, {
    params: { id_solicitud, id_aprobador, observacion },
  })

  return response.data
}

export const getAdminPendingRequests = async () => {
  const response = await apiClient.get('/solicitudes/pendientes-admin')

  return response.data.items as Request[]
}