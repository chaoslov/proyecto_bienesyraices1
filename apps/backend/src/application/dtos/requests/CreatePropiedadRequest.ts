export interface CreatePropiedadRequest {
  titulo: string
  descripcion: string
  precio: number
  tipoPropiedad: 'casa' | 'departamento' | 'terreno' | 'local' | 'oficina'
  tipoTransaccion: 'venta' | 'alquiler'
  habitaciones?: number
  banios?: number
  parqueos?: number
  metrajeTotal?: number
  metrajeConstruido?: number
  destacada?: boolean
  asesorId: string
  ubicacion: {
    direccion: string
    sector?: string
    ciudad?: string
    provincia?: string
    latitud: number
    longitud: number
  }
}