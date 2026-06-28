import { asesorRepository } from '../../infrastructure/repositories/AsesorRepository'
import { createAsesorSchema, updateAsesorSchema } from '../validations/asesor.validation'
import bcrypt from 'bcryptjs'

export class AsesorService {
  async listar() { return asesorRepository.findAll() }

  async obtenerPorId(id: string) {
    const asesor = await asesorRepository.findById(id)
    if (!asesor) throw { status: 404, message: 'Asesor no encontrado' }
    return asesor
  }

  async crear(data: any) {
    const validData = createAsesorSchema.parse(data)
    const existente = await asesorRepository.findByEmail(validData.email)
    if (existente) throw { status: 400, message: 'Email ya registrado' }
    const hashedPassword = await bcrypt.hash(validData.password, 10)
    return asesorRepository.create({ ...validData, password: hashedPassword })
  }

  async actualizar(id: string, data: any) {
    const exists = await asesorRepository.findById(id)
    if (!exists) throw { status: 404, message: 'Asesor no encontrado' }
    const validData = updateAsesorSchema.parse(data)
    return asesorRepository.update(id, validData)
  }

  async eliminar(id: string) {
    const exists = await asesorRepository.findById(id)
    if (!exists) throw { status: 404, message: 'Asesor no encontrado' }
    await asesorRepository.delete(id)
  }
}

export const asesorService = new AsesorService()