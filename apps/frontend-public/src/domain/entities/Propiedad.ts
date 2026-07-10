export interface Ubicacion {
  direccion: string
  sector?: string
  ciudad: string
  latitud: number
  longitud: number
}

export interface Propiedad {
  id: string
  titulo: string
  descripcion: string
  precio: number
  tipoTransaccion: 'venta' | 'alquiler'
  tipoInmueble: string
  habitaciones: number
  banos: number
  areaTotal: number
  destacada: boolean
  publicada: boolean
  asesorId: string
  ubicacion: Ubicacion
  imagenes: string[]
  creadoEn: Date
  asesor?: {
    id: string
    nombre: string
    telefono?: string
  }
}
