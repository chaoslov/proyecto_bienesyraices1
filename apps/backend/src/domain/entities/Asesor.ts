export interface AsesorEntity {
  id: string
  userId: string
  nombre: string
  telefono: string
  foto: string | null
  especialidad: string | null
  descripcion: string | null
  añosExperiencia: number | null
  createdAt: Date
  updatedAt: Date
}
