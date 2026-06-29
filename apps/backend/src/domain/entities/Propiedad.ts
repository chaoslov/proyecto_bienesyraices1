export interface PropiedadEntity {
  id: string
  titulo: string
  descripcion: string
  precio: number
  tipoPropiedad: string
  tipoTransaccion: string
  habitaciones: number | null
  banios: number | null
  parqueos: number | null
  metrajeTotal: number | null
  metrajeConstruido: number | null
  estado: string
  destacada: boolean
  asesorId: string
  ubicacionId: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
