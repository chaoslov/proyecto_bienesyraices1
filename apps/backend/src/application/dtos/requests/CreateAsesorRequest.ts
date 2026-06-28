export interface CreateAsesorRequest {
  nombre: string
  email: string
  password: string
  telefono: string
  foto?: string
  especialidad?: string
  descripcion?: string
  añosExperiencia?: number
  rol?: 'asesor' | 'admin'
}