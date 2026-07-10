import { AsesorEntity } from '../entities/Asesor'

export interface IAsesorRepository {
  findAll(): Promise<any[]>
  findAllPublic(): Promise<any[]>
  findById(id: string): Promise<any | null>
  findByEmail(email: string): Promise<any | null>
  create(data: {
    nombre: string
    email: string
    password: string
    telefono?: string
    foto?: string
    especialidad?: string
    descripcion?: string
    añosExperiencia?: number
    rol?: 'asesor' | 'admin'
  }): Promise<any>
  update(id: string, data: Record<string, unknown>): Promise<any>
  delete(id: string): Promise<void>
}