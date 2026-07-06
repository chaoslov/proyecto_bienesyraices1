import { api } from '../httpClient'
import { mapPropiedadDesdeAPI, mapPropiedadesLista, mapFiltrosParaAPI, mapPropiedadParaAPI } from '../mappers/propiedadMapper'
import { Propiedad } from '@/domain/entities/Propiedad'

export interface PaginatedResult {
  data: Propiedad[]
  total: number
  page: number
  limit: number
}

export const PropiedadApi = {
  async listar(filtros?: Record<string, any>, page = 1, limit = 12): Promise<PaginatedResult> {
    const params: Record<string, string | number | undefined> = {
      ...mapFiltrosParaAPI(filtros || {}),
      page,
      limit,
    }
    const res = await api.get<{ data: any[]; total: number; page: number; limit: number }>('/propiedades', params)
    return {
      data: mapPropiedadesLista(res.data),
      total: res.total,
      page: res.page,
      limit: res.limit,
    }
  },

  async destacadas(limit = 6): Promise<Propiedad[]> {
    const res = await api.get<any[]>('/propiedades/destacadas', { limit })
    return mapPropiedadesLista(res)
  },

  async obtenerPorId(id: string): Promise<Propiedad> {
    const res = await api.get<any>(`/propiedades/${id}`)
    return mapPropiedadDesdeAPI(res)
  },

  async crear(data: any): Promise<any> {
    const body = mapPropiedadParaAPI(data)
    return api.post<any>('/propiedades', body)
  },

  async actualizar(id: string, data: any): Promise<any> {
    const body = mapPropiedadParaAPI(data)
    return api.put<any>(`/propiedades/${id}`, body)
  },

  async cambiarEstado(id: string, estado: string): Promise<any> {
    return api.patch<any>(`/propiedades/${id}/estado`, { estado })
  },

  async eliminar(id: string): Promise<void> {
    return api.delete<void>(`/propiedades/${id}`)
  },
}
