import apiClient from '../api/apiClient'

export interface Department {
  id_departamento: number
  nombre: string
}

export interface Position {
  id_puesto: number
  id_departamento: number
  nombre: string
}

export const getDepartments = async () => {
  const response = await apiClient.get('/usuarios/departamentos')
  return response.data.items as Department[]
}

export const getPositionsByDepartment = async (id_departamento: number) => {
  const response = await apiClient.get('/usuarios/puestos', {
    params: { id_departamento },
  })

  return response.data.items as Position[]
}