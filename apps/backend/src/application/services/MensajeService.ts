import { IMensajeRepository } from '../../domain/ports/IMensajeRepository'
import { createMensajeSchema } from '../validations/mensaje.validation'
import { AuthorizationService } from './AuthorizationService'
import { AppError } from './AppError'
import { validate } from './validate'

export class MensajeService {
  constructor(
    private repository: IMensajeRepository,
    private authService: AuthorizationService,
  ) {}

  async listarPorAsesor(asesorId: string, filtros?: { leido?: boolean; archivado?: boolean }) {
    return this.repository.findAllByAsesorId(asesorId, filtros)
  }

  async listarTodosAdmin(filtros?: { tipo?: string; leido?: boolean; archivado?: boolean }) {
    return this.repository.findAllAdmin(filtros)
  }

  async obtenerPorId(id: string) {
    const mensaje = await this.repository.findById(id)
    if (!mensaje) throw new AppError(404, 'Mensaje no encontrado')
    return mensaje
  }

  async crear(data: unknown) {
    const validData = validate(createMensajeSchema, data)
    return this.repository.create(validData)
  }

  async marcarLeido(id: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Mensaje no encontrado')
    this.authService.verificarOwnership(exists, user, 'No tienes permisos sobre este mensaje')
    return this.repository.update(id, { leido: true })
  }

  async archivar(id: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Mensaje no encontrado')
    this.authService.verificarOwnership(exists, user, 'No tienes permisos sobre este mensaje')
    return this.repository.update(id, { archivado: true })
  }

  async eliminar(id: string, user?: { id: string; rol: string; asesorId: string | null }) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Mensaje no encontrado')
    this.authService.verificarOwnership(exists, user, 'No tienes permisos sobre este mensaje')
    await this.repository.delete(id)
  }

  async asignar(id: string, targetAsesorId: string, user: { id: string; rol: string; adminId: string | null }) {
    const mensaje = await this.repository.findById(id)
    if (!mensaje) throw new AppError(404, 'Mensaje no encontrado')
    if (user.rol !== 'admin' || !user.adminId) {
      throw new AppError(403, 'Solo el admin puede asignar mensajes')
    }
    return this.repository.update(id, {
      asesorId: targetAsesorId,
      asignadoPor: user.adminId,
      estadoAsignacion: 'pendiente',
    })
  }

  async aceptarAsignacion(id: string, user: { id: string; rol: string; asesorId: string | null }) {
    const mensaje = await this.repository.findById(id)
    if (!mensaje) throw new AppError(404, 'Mensaje no encontrado')
    this.authService.verificarOwnership(mensaje, user, 'No tienes permisos sobre este mensaje')
    if (mensaje.estadoAsignacion !== 'pendiente') {
      throw new AppError(400, 'Este mensaje no tiene una asignación pendiente')
    }
    return this.repository.update(id, { estadoAsignacion: 'aceptado' })
  }

  async rechazarAsignacion(id: string, user: { id: string; rol: string; asesorId: string | null }) {
    const mensaje = await this.repository.findById(id)
    if (!mensaje) throw new AppError(404, 'Mensaje no encontrado')
    this.authService.verificarOwnership(mensaje, user, 'No tienes permisos sobre este mensaje')
    if (mensaje.estadoAsignacion !== 'pendiente') {
      throw new AppError(400, 'Este mensaje no tiene una asignación pendiente')
    }
    return this.repository.update(id, {
      asesorId: mensaje.asignadoPor,
      asignadoPor: null,
      estadoAsignacion: 'rechazado',
    })
  }
}