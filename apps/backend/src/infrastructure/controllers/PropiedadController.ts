import { Request, Response } from 'express'
import { PropiedadService } from '../../application/services/PropiedadService'
import { getId } from '../middlewares/validateId'
import { getAsesorId } from '../middlewares/authMiddleware'

export class PropiedadController {
  constructor(private service: PropiedadService) {}

  listar = async (req: Request, res: Response) => {
    try {
      const result = await this.service.listar(req.query)
      res.json(result)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  listarDestacadas = async (_req: Request, res: Response) => {
    try {
      const propiedades = await this.service.listarDestacadas()
      res.json(propiedades)
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener destacadas' })
    }
  }

  listarMias = async (req: Request, res: Response) => {
    try {
      const asesorId = getAsesorId(req)
      const result = await this.service.listarMias(asesorId)
      res.json(result)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  obtenerPorId = async (req: Request, res: Response) => {
    try {
      const propiedad = await this.service.obtenerPorId(getId(req))
      res.json(propiedad)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  crear = async (req: Request, res: Response) => {
    try {
      const body = { ...req.body, asesorId: getAsesorId(req) }
      const propiedad = await this.service.crear(body)
      res.status(201).json(propiedad)
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: error.message, errors: error.errors })
      }
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  actualizar = async (req: Request, res: Response) => {
    try {
      const propiedad = await this.service.actualizar(getId(req), req.body, (req as any).user)
      res.json(propiedad)
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: error.message, errors: error.errors })
      }
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  eliminar = async (req: Request, res: Response) => {
    try {
      await this.service.eliminar(getId(req), (req as any).user)
      res.status(204).send()
    } catch (error: any) {
      console.error('Error al eliminar propiedad:', error)
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  cambiarEstado = async (req: Request, res: Response) => {
    try {
      const propiedad = await this.service.cambiarEstado(getId(req), req.body.estado, (req as any).user)
      res.json(propiedad)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }
}
