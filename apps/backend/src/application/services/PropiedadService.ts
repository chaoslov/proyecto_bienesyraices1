import { propiedadRepository } from '../../infrastructure/repositories/PropiedadRepository'
import { createPropiedadSchema, updatePropiedadSchema } from '../validations/propiedad.validation'
import { ZodError } from 'zod'

export class PropiedadService {
  async listar(filtros: any) {
    return propiedadRepository.findAll(filtros)
  }

  async listarDestacadas() {
    return propiedadRepository.findDestacadas()
  }

  async obtenerPorId(id: string) {
    const propiedad = await propiedadRepository.findById(id)
    if (!propiedad) throw { status: 404, message: 'Propiedad no encontrada' }
    return propiedad
  }

  async crear(data: any) {
    try {
      const validData = createPropiedadSchema.parse(data)
      return propiedadRepository.create(validData)
    } catch (error) {
      if (error instanceof ZodError) {
        throw { status: 400, message: 'Datos inválidos', errors: error.issues }
      }
      throw error
    }
  }

  async actualizar(id: string, data: any) {
    const exists = await propiedadRepository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }

    try {
      const validData = updatePropiedadSchema.parse(data)
      return propiedadRepository.update(id, validData)
    } catch (error) {
      if (error instanceof ZodError) {
        throw { status: 400, message: 'Datos inválidos', errors: error.issues }
      }
      throw error
    }
  }

  async eliminar(id: string) {
    const exists = await propiedadRepository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }
    await propiedadRepository.delete(id)
  }

  async cambiarEstado(id: string, estado: string) {
    const exists = await propiedadRepository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }
    return propiedadRepository.update(id, { estado })
  }
}

export const propiedadService = new PropiedadService()