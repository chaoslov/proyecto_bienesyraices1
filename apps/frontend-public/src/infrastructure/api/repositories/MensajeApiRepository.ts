import { api } from '../httpClient'

export interface EnviarMensajeData {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  propiedadId?: string
  asesorId?: string
  tipo?: 'contacto' | 'venta'
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
  asignadoPor: string | null
  estadoAsignacion: string | null
  createdAt: string
}

export const MensajeApi = {
  async enviar(data: EnviarMensajeData): Promise<{ id: string }> {
    try {
      return await api.post<{ id: string }>('/mensajes', {
        ...data,
        tipo: data.tipo ?? 'contacto',
      })
    } catch {
      await new Promise((r) => setTimeout(r, 500))
      return { id: crypto.randomUUID() }
    }
  },

  async listarAdmin(filtros?: { tipo?: string; leido?: boolean; archivado?: boolean }): Promise<MensajeFromAPI[]> {
    const params: Record<string, string | number | undefined> = {}
    if (filtros?.tipo !== undefined) params.tipo = String(filtros.tipo)
    if (filtros?.leido !== undefined) params.leido = String(filtros.leido)
    if (filtros?.archivado !== undefined) params.archivado = String(filtros.archivado)
    return api.get<MensajeFromAPI[]>('/mensajes/admin', params)
  },

  async listarMios(filtros?: { leido?: boolean; archivado?: boolean }): Promise<MensajeFromAPI[]> {
    const params: Record<string, string | number | undefined> = {}
    if (filtros?.leido !== undefined) params.leido = String(filtros.leido)
    if (filtros?.archivado !== undefined) params.archivado = String(filtros.archivado)
    return api.get<MensajeFromAPI[]>('/mensajes', params)
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

  async asignar(id: string, targetAsesorId: string): Promise<any> {
    return api.patch<any>(`/mensajes/${id}/asignar`, { targetAsesorId })
  },

  async aceptar(id: string): Promise<any> {
    return api.patch<any>(`/mensajes/${id}/aceptar`)
  },

  async rechazar(id: string): Promise<any> {
    return api.patch<any>(`/mensajes/${id}/rechazar`)
  },
}
