import { api } from '../httpClient'
import { mapAsesoresLista, mapAsesorFromAPI } from '../mappers/asesorMapper'
import { Asesor } from '@/domain/entities/Asesor'

export interface CrearAsesorData {
  nombre: string
  email: string
  password: string
  telefono: string
  especialidad?: string
  descripcion?: string
  añosExperiencia?: number
  rol?: 'asesor' | 'admin'
}

export interface ActualizarAsesorData {
  nombre?: string
  email?: string
  password?: string
  telefono?: string
  especialidad?: string
  descripcion?: string
  añosExperiencia?: number
}

export const AsesorApi = {
  async listar(): Promise<Asesor[]> {
    const res = await api.get<any[]>('/asesores')
    return mapAsesoresLista(res)
  },

  async listarAdmin(): Promise<Asesor[]> {
    const res = await api.get<any[]>('/asesores/admin')
    return mapAsesoresLista(res)
  },

  async obtenerPorId(id: string): Promise<Asesor> {
    const res = await api.get<any>(`/asesores/${id}`)
    return mapAsesorFromAPI(res)
  },

  async crear(data: CrearAsesorData): Promise<Asesor> {
    const res = await api.post<any>('/asesores', data)
    return mapAsesorFromAPI(res)
  },

  async actualizar(id: string, data: ActualizarAsesorData): Promise<Asesor> {
    const res = await api.put<any>(`/asesores/${id}`, data)
    return mapAsesorFromAPI(res)
  },

  async eliminar(id: string): Promise<void> {
    await api.delete(`/asesores/${id}`)
  },
}
