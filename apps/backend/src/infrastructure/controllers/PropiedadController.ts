import { Request, Response, NextFunction } from 'express'
import { PropiedadService } from '../../application/services/PropiedadService'
import { getId } from '../middlewares/validateId'
import { getAsesorId } from '../middlewares/authMiddleware'

export class PropiedadController {
  constructor(private service: PropiedadService) {}

  listar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.listar(req.query)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  listarDestacadas = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const propiedades = await this.service.listarDestacadas()
      res.json(propiedades)
    } catch (error) {
      next(error)
    }
  }

  listarMias = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asesorId = getAsesorId(req)
      const filtros = { ...req.query, asesorId }
      const result = await this.service.listar(filtros)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const propiedad = await this.service.obtenerPorId(getId(req))
      res.json(propiedad)
    } catch (error) {
      next(error)
    }
  }

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = { ...req.body, asesorId: getAsesorId(req) }
      const propiedad = await this.service.crear(body)
      res.status(201).json(propiedad)
    } catch (error) {
      next(error)
    }
  }

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const propiedad = await this.service.actualizar(getId(req), req.body, req.user)
      res.json(propiedad)
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

  cambiarEstado = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const propiedad = await this.service.cambiarEstado(getId(req), req.body.estado, req.user)
      res.json(propiedad)
    } catch (error) {
      next(error)
    }
  }
}