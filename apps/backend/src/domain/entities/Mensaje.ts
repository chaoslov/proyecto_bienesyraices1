export interface MensajeEntity {
  id: string
  nombre: string
  email: string
  telefono: string | null
  mensaje: string
  tipo: string
  leido: boolean
  archivado: boolean
  propiedadId: string | null
  asesorId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateMensajeData {
  nombre: string
  email: string
  telefono?: string
  mensaje: string
  tipo: string
  propiedadId?: string
  asesorId: string
}

export interface UpdateMensajeData {
  leido?: boolean
  archivado?: boolean
}
