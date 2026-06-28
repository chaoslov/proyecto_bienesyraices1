export interface PropiedadResponse {
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
  asesor: { id: string; nombre: string; telefono: string }
  ubicacion: { id: string; direccion: string; sector: string | null; ciudad: string; provincia: string; latitud: number; longitud: number }
  imagenes: { id: string; url: string; orden: number }[]
  createdAt: string
}