import { IPropiedadRepository } from '../../domain/ports/IPropiedadRepository'
import { createPropiedadSchema, updatePropiedadSchema, filtrosPropiedadSchema } from '../validations/propiedad.validation'
import { ZodError } from 'zod'
import { ImagenService } from './ImagenService'


export class PropiedadService {
  constructor(
    private repository: IPropiedadRepository,
    private imagenService: ImagenService,
  ) { }

  async listar(filtros: any) {
    const filtrosValidos = filtrosPropiedadSchema.parse(filtros)
    return this.repository.findAll(filtrosValidos)
  }

  async listarDestacadas() {
    return this.repository.findDestacadas()
  }

  async listarMias(asesorId: string) {
    return this.repository.findAll({ asesorId })
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

  async actualizar(id: string, data: any, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }

    this.verificarOwnership(exists, user)

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

  async eliminar(id: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }

    this.verificarOwnership(exists, user)

    await this.imagenService.eliminarPorPropiedadId(id)
    await this.repository.delete(id)
  }

  async cambiarEstado(id: string, estado: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw { status: 404, message: 'Propiedad no encontrada' }

    this.verificarOwnership(exists, user)

    return this.repository.update(id, { estado })
  }

  private verificarOwnership(propiedad: any, user?: { id: string; rol: string; asesorId: string | null }) {
    if (!user) return
    if (user.rol === 'admin') return
    if (propiedad.asesorId !== user.asesorId) {
      throw { status: 403, message: 'No tienes permisos sobre esta propiedad' }
    }
  }
}
