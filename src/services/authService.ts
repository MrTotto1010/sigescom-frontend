import apiClient from '../api/apiClient'

export interface LoginRequest {
  correo: string
  password_hash: string
}

export interface LoginResponse {
  success: boolean
  id_usuario?: number
  nombre?: string
  roles?: string[]
  message?: string
}

export interface RegisterRequest {
  id_departamento: number
  id_puesto: number
  nombre_completo: string
  correo: string
  password_hash: string
  telefono: string
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post('/usuarios/login', null, {
    params: data,
  })

  return response.data
}

export const register = async (data: RegisterRequest) => {
  const response = await apiClient.post('/usuarios/register', null, {
    params: data,
  })

  return response.data
}

export const requestPasswordReset = async (correo: string) => {
  const response = await apiClient.post('/usuarios/reset-password', null, {
    params: { correo },
  })

  return response.data
}

export const changePassword = async (codigo: string, password_hash: string) => {
  const response = await apiClient.post('/usuarios/cambiar-password', null, {
    params: { codigo, password_hash },
  })

  return response.data
}