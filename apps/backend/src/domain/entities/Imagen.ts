export interface ImagenEntity {
  id: string
  url: string
  publicId: string
  orden: number
  propiedadId: string
}

export interface CreateImagenData {
  url: string
  publicId: string
  orden: number
  propiedadId: string
}
