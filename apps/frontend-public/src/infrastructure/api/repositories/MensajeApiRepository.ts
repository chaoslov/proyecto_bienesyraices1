import { api } from '../httpClient'

export interface EnviarMensajeData {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  propiedadId?: string
  asesorId?: string
}

export interface MensajeFromAPI {
  id: string
  nombre: string
  email: string
  telefono: string | null
  mensaje: string
  leido: boolean
  archivado: boolean
  propiedadTitulo?: string
  propiedadId: string | null
  asesorId: string
  createdAt: string
}

export const MensajeApi = {
  async enviar(data: EnviarMensajeData): Promise<{ id: string }> {
    return api.post<{ id: string }>('/mensajes', {
      ...data,
      tipo: 'contacto',
    })
  },

  async listarPorAsesor(asesorId: string, filtros?: { leido?: boolean; archivado?: boolean }): Promise<MensajeFromAPI[]> {
    const params: Record<string, string | number | undefined> = {}
    if (filtros?.leido !== undefined) params.leido = String(filtros.leido)
    if (filtros?.archivado !== undefined) params.archivado = String(filtros.archivado)
    return api.get<MensajeFromAPI[]>(`/mensajes/asesor/${asesorId}`, params)
  },

  async marcarLeido(id: string): Promise<any> {
    return api.patch<any>(`/mensajes/${id}/leer`)
  },

  async archivar(id: string): Promise<any> {
    return api.patch<any>(`/mensajes/${id}/archivar`)
  },

  async eliminar(id: string): Promise<void> {
    return api.delete<void>(`/mensajes/${id}`)
  },
}
