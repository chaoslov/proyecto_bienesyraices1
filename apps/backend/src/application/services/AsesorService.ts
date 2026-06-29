import { IAsesorRepository } from '../../domain/ports/IAsesorRepository'
import { createAsesorSchema, updateAsesorSchema } from '../validations/asesor.validation'
import bcrypt from 'bcryptjs'

export class AsesorService {
  constructor(private repository: IAsesorRepository) {}

  async listar() { return this.repository.findAll() }

  async obtenerPorId(id: string) {
    const asesor = await this.repository.findById(id)
    if (!asesor) throw { status: 404, message: 'Asesor no encontrado' }
    return asesor
  }

  async crear(data: any) {
    const validData = createAsesorSchema.parse(data)
    const existente = await this.repository.findByEmail(validData.email)
    if (existente) throw { status: 400, message: 'Email ya registrado' }
    const hashedPassword = await bcrypt.hash(validData.password, 10)
    return this.repository.create({ ...validData, password: hashedPassword })
  }

  async actualizar(id: string, data: any) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Asesor no encontrado' }
    const validData = updateAsesorSchema.parse(data)
    return this.repository.update(id, validData)
  }

  async eliminar(id: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Asesor no encontrado' }
    await this.repository.delete(id)
  }
}
