export interface IImagenRepository {
  findAllByPropiedadId(propiedadId: string): Promise<any[]>
  findById(id: string): Promise<any | null>
  create(data: { url: string; publicId: string; orden: number; propiedadId: string }): Promise<any>
  createMany(data: { url: string; publicId: string; orden: number; propiedadId: string }[]): Promise<any>
  delete(id: string): Promise<void>
}