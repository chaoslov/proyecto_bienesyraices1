import { IMensajeRepository } from '../../domain/ports/IMensajeRepository'
import { createMensajeSchema } from '../validations/mensaje.validation'
import { ZodError } from 'zod'

export class MensajeService {
  constructor(private repository: IMensajeRepository) {}

  async listarPorAsesor(asesorId: string, filtros?: { leido?: boolean; archivado?: boolean }) {
    return this.repository.findAllByAsesorId(asesorId, filtros)
  }

  async obtenerPorId(id: string) {
    const mensaje = await this.repository.findById(id)
    if (!mensaje) throw { status: 404, message: 'Mensaje no encontrado' }
    return mensaje
  }

  async crear(data: any) {
    try {
      const validData = createMensajeSchema.parse(data)
      return this.repository.create(validData)
    } catch (error) {
      if (error instanceof ZodError) {
        throw { status: 400, message: 'Datos inválidos', errors: error.issues }
      }
      throw error
    }
  }

  async marcarLeido(id: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Mensaje no encontrado' }
    return this.repository.update(id, { leido: true })
  }

  async archivar(id: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Mensaje no encontrado' }
    return this.repository.update(id, { archivado: true })
  }

  async eliminar(id: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Mensaje no encontrado' }
    await this.repository.delete(id)
  }
}