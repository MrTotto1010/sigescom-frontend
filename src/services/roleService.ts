import apiClient from '../api/apiClient'

export interface Role {
  id_rol: number
  nombre: string
  descripcion: string
}

export interface RoleChangeRequest {
  id_solicitud_cambio: number
  id_usuario: number
  nombre_completo: string
  id_rol_solicitado: number
  rol_solicitado: string
  justificacion: string
  fecha_solicitud: string
  estado: string
}

export const getRoles = async () => {
  const response = await apiClient.get('/roles/listar')
  return response.data.items as Role[]
}

export const getRoleChangeRequests = async () => {
  const response = await apiClient.get('/roles/solicitudes')
  return response.data.items as RoleChangeRequest[]
}

export const requestRoleChange = async (
  id_usuario: number,
  id_rol_solicitado: number,
  justificacion: string,
) => {
  const response = await apiClient.post('/roles/solicitar', null, {
    params: {
      id_usuario,
      id_rol_solicitado,
      justificacion,
    },
  })

  return response.data
}

export const approveRoleChange = async (id_solicitud_cambio: number) => {
  const response = await apiClient.post('/roles/aprobar', null, {
    params: { id_solicitud_cambio },
  })

  return response.data
}

export const rejectRoleChange = async (id_solicitud_cambio: number) => {
  const response = await apiClient.post('/roles/rechazar', null, {
    params: { id_solicitud_cambio },
  })

  return response.data
}