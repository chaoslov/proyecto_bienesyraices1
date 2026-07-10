export interface IPropiedadRepository {
  findAll(filtros?: Record<string, unknown>): Promise<{
    data: any[]
    total: number
    page: number
    limit: number
  }>
  findById(id: string): Promise<any | null>
  findByAsesorId(asesorId: string): Promise<any[]>
  findDestacadas(limit?: number): Promise<any[]>
  create(data: Record<string, unknown>): Promise<any>
  update(id: string, data: Record<string, unknown>): Promise<any>
  delete(id: string): Promise<void>
  countByAsesorId(asesorId: string): Promise<number>
}