import { IPropiedadRepository } from '../../domain/ports/IPropiedadRepository'
import { createPropiedadSchema, updatePropiedadSchema, filtrosPropiedadSchema } from '../validations/propiedad.validation'
import { ZodError } from 'zod'


export class PropiedadService {
  constructor(private repository: IPropiedadRepository) { }

  async listar(filtros: any) {
    const filtrosValidos = filtrosPropiedadSchema.parse(filtros)
    return this.repository.findAll(filtrosValidos)
  }

  async listarDestacadas() {
    return this.repository.findDestacadas()
  }

  async obtenerPorId(id: string) {
    const propiedad = await this.repository.findById(id)
    if (!propiedad) throw { status: 404, message: 'Propiedad no encontrada' }
    return propiedad
  }

  async crear(data: any) {
    try {
      const validData = createPropiedadSchema.parse(data)
      return this.repository.create(validData)
    } catch (error) {
      if (error instanceof ZodError) {
        throw { status: 400, message: 'Datos inválidos', errors: error.issues }
      }
      throw error
    }
  }

  async actualizar(id: string, data: any) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }

    try {
      const validData = updatePropiedadSchema.parse(data)
      return this.repository.update(id, validData)
    } catch (error) {
      if (error instanceof ZodError) {
        throw { status: 400, message: 'Datos inválidos', errors: error.issues }
      }
      throw error
    }
  }

  async eliminar(id: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }
    await this.repository.delete(id)
  }

  async cambiarEstado(id: string, estado: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }
    return this.repository.update(id, { estado })
  }
}
