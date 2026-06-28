export interface FiltrosPropiedadRequest {
  precioMin?: number
  precioMax?: number
  tipoPropiedad?: string
  tipoTransaccion?: string
  habitaciones?: number
  ubicacion?: string
  asesorId?: string
  estado?: string
  busqueda?: string
  destacada?: boolean
  page?: number
  limit?: number
}