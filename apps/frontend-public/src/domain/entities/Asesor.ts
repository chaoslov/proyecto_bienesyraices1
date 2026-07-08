export interface Asesor {
  id: string
  nombre: string
  apellido: string
  email: string
  telefono: string
  fotografia: string
  especialidad: string
  descripcion?: string
  experiencia: number
  creadoEn: Date
  propiedadesCount?: number
}
