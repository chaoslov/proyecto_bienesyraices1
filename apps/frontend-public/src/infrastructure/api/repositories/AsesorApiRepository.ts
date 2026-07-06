import { api } from '../httpClient'
import { mapAsesoresLista, mapAsesorDesdeAPI } from '../mappers/asesorMapper'
import { Asesor } from '@/domain/entities/Asesor'

export const AsesorApi = {
  async listar(): Promise<Asesor[]> {
    const res = await api.get<any[]>('/asesores')
    return mapAsesoresLista(res)
  },

  async obtenerPorId(id: string): Promise<Asesor> {
    const res = await api.get<any>(`/asesores/${id}`)
    return mapAsesorDesdeAPI(res)
  },
}
