export interface IMensajeRepository {
  findAllByAsesorId(asesorId: string, filtros?: {
    leido?: boolean
    archivado?: boolean
  }): Promise<any[]>
  findById(id: string): Promise<any | null>
  create(data: any): Promise<any>
  update(id: string, data: any): Promise<any>
  delete(id: string): Promise<void>
  countNoLeidos(asesorId: string): Promise<number>
}