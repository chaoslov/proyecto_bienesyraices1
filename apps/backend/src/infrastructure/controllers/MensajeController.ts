import { Request, Response, NextFunction } from 'express'
import { MensajeService } from '../../application/services/MensajeService'
import { getId } from '../middlewares/validateId'
import { getAsesorId } from '../middlewares/authMiddleware'

export class MensajeController {
  constructor(private service: MensajeService) {}

  listarMios = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asesorId = getAsesorId(req)
      const { leido, archivado } = req.query
      const filtros: { leido?: boolean; archivado?: boolean } = {}
      if (leido !== undefined) filtros.leido = leido === 'true'
      if (archivado !== undefined) filtros.archivado = archivado === 'true'
      const mensajes = await this.service.listarPorAsesor(asesorId, filtros)
      res.json(mensajes)
    } catch (error) {
      next(error)
    }
  }

  listarTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tipo, leido, archivado } = req.query
      const filtros: { tipo?: string; leido?: boolean; archivado?: boolean } = {}
      if (tipo !== undefined) filtros.tipo = tipo as string
      if (leido !== undefined) filtros.leido = leido === 'true'
      if (archivado !== undefined) filtros.archivado = archivado === 'true'
      const mensajes = await this.service.listarTodosAdmin(filtros)
      res.json(mensajes)
    } catch (error) {
      next(error)
    }
  }

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mensaje = await this.service.crear(req.body)
      res.status(201).json(mensaje)
    } catch (error) {
      next(error)
    }
  }

  marcarLeido = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mensaje = await this.service.marcarLeido(getId(req), req.user)
      res.json(mensaje)
    } catch (error) {
      next(error)
    }
  }

  archivar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mensaje = await this.service.archivar(getId(req), req.user)
      res.json(mensaje)
    } catch (error) {
      next(error)
    }
  }

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.eliminar(getId(req), req.user)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  asignar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { targetAsesorId } = req.body
      if (!targetAsesorId) {
        return res.status(400).json({ message: 'targetAsesorId es requerido' })
      }
      const mensaje = await this.service.asignar(getId(req), targetAsesorId, req.user!)
      res.json(mensaje)
    } catch (error) {
      next(error)
    }
  }

  aceptar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mensaje = await this.service.aceptarAsignacion(getId(req), req.user!)
      res.json(mensaje)
    } catch (error) {
      next(error)
    }
  }

  rechazar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mensaje = await this.service.rechazarAsignacion(getId(req), req.user!)
      res.json(mensaje)
    } catch (error) {
      next(error)
    }
  }
}