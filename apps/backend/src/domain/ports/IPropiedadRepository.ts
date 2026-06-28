import { Prisma } from '../../generated/prisma/client'

export interface IPropiedadRepository {
  findAll(filtros?: {
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
  }): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
  }>

  findById(id: string): Promise<any | null>
  findByAsesorId(asesorId: string): Promise<any[]>
  findDestacadas(limit?: number): Promise<any[]>
  create(data: any): Promise<any>
  update(id: string, data: any): Promise<any>
  delete(id: string): Promise<void>
  countByAsesorId(asesorId: string): Promise<number>
}