export interface AsesorResponse {
  id: string
  nombre: string
  email: string
  telefono: string
  foto: string | null
  especialidad: string | null
  descripcion: string | null
  añosExperiencia: number | null
  rol: string
  propiedadesCount: number
  mensajesNoLeidos: number
}