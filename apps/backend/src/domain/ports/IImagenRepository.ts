import { ImagenEntity, CreateImagenData } from '../entities/Imagen'

export interface IImagenRepository {
  findAllByPropiedadId(propiedadId: string): Promise<ImagenEntity[]>
  findById(id: string): Promise<ImagenEntity | null>
  create(data: CreateImagenData): Promise<ImagenEntity>
  createMany(data: CreateImagenData[]): Promise<any>
  delete(id: string): Promise<void>
}