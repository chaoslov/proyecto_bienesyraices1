import { CreateMensajeData, UpdateMensajeData } from '../entities/Mensaje'

export interface IMensajeRepository {
  findAllByAsesorId(asesorId: string, filtros?: {
    leido?: boolean
    archivado?: boolean
  }): Promise<any[]>
  findById(id: string): Promise<any | null>
  create(data: CreateMensajeData): Promise<any>
  update(id: string, data: UpdateMensajeData): Promise<any>
  delete(id: string): Promise<void>
  countNoLeidos(asesorId: string): Promise<number>
}