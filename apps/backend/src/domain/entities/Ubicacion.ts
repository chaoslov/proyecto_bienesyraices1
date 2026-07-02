export interface UbicacionEntity {
  id: string
  direccion: string
  sector: string | null
  ciudad: string
  provincia: string
  latitud: number
  longitud: number
}
