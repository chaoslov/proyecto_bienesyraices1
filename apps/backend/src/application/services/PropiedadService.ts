import { IPropiedadRepository } from '../../domain/ports/IPropiedadRepository'
import { createPropiedadSchema, updatePropiedadSchema, filtrosPropiedadSchema } from '../validations/propiedad.validation'
import { ImagenService } from './ImagenService'
import { AuthorizationService } from './AuthorizationService'
import { AppError } from './AppError'
import { validate } from './validate'

export class PropiedadService {
  constructor(
    private repository: IPropiedadRepository,
    private imagenService: ImagenService,
    private authService: AuthorizationService,
  ) {}

  async listar(filtros: unknown) {
    const filtrosValidos = filtrosPropiedadSchema.parse(filtros)
    return this.repository.findAll(filtrosValidos as Record<string, unknown>)
  }

  async listarDestacadas() {
    return this.repository.findDestacadas()
  }

  async listarMias(asesorId: string) {
    return this.repository.findAll({ asesorId })
  }

  async obtenerPorId(id: string) {
    const propiedad = await this.repository.findById(id)
    if (!propiedad) throw new AppError(404, 'Propiedad no encontrada')
    return propiedad
  }

  async crear(data: unknown) {
    const validData = validate(createPropiedadSchema, data)
    return this.repository.create(validData as Record<string, unknown>)
  }

  async actualizar(id: string, data: unknown, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Propiedad no encontrada')
    this.authService.verificarOwnership(exists, user, 'No tienes permisos sobre esta propiedad')
    const validData = validate(updatePropiedadSchema, data)
    return this.repository.update(id, validData as Record<string, unknown>)
  }

  async eliminar(id: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Propiedad no encontrada')
    this.authService.verificarOwnership(exists, user, 'No tienes permisos sobre esta propiedad')
    await this.imagenService.eliminarPorPropiedadId(id)
    await this.repository.delete(id)
  }

  async cambiarEstado(id: string, estado: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Propiedad no encontrada')
    this.authService.verificarOwnership(exists, user, 'No tienes permisos sobre esta propiedad')
    return this.repository.update(id, { estado })
  }
}