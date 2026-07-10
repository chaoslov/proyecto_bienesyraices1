import { Request, Response, NextFunction } from 'express'
import { AsesorService } from '../../application/services/AsesorService'
import { getId } from '../middlewares/validateId'

export class AsesorController {
  constructor(private service: AsesorService) {}

  listar = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const asesores = await this.service.listarPublicos()
      res.json(asesores)
    } catch (error) {
      next(error)
    }
  }

  listarAdmin = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const asesores = await this.service.listar()
      res.json(asesores)
    } catch (error) {
      next(error)
    }
  }

  obtenerPorId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asesor = await this.service.obtenerPorId(getId(req))
      res.json(asesor)
    } catch (error) {
      next(error)
    }
  }

  crear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asesor = await this.service.crear(req.body)
      res.status(201).json(asesor)
    } catch (error) {
      next(error)
    }
  }

  actualizar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const asesor = await this.service.actualizar(getId(req), req.body)
      res.json(asesor)
    } catch (error) {
      next(error)
    }
  }

  eliminar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.eliminar(getId(req))
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  subirFoto = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Archivo de foto requerido' })
      }
      const asesor = await this.service.subirFoto(getId(req), req.file)
      res.json(asesor)
    } catch (error) {
      next(error)
    }
  }
}