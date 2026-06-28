import { Request, Response } from 'express'
import { propiedadService } from '../../application/services/PropiedadService'
import { getId } from '../middlewares/validateId'

export class PropiedadController {
  static async listar(req: Request, res: Response) {
    try {
      const result = await propiedadService.listar(req.query)
      res.json(result)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async listarDestacadas(_req: Request, res: Response) {
    try {
      const propiedades = await propiedadService.listarDestacadas()
      res.json(propiedades)
    } catch (error: any) {
      res.status(500).json({ message: 'Error al obtener destacadas' })
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const propiedad = await propiedadService.obtenerPorId(getId(req))
      res.json(propiedad)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const propiedad = await propiedadService.crear(req.body)
      res.status(201).json(propiedad)
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: error.message, errors: error.errors })
      }
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const propiedad = await propiedadService.actualizar(getId(req), req.body)
      res.json(propiedad)
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ message: error.message, errors: error.errors })
      }
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      await propiedadService.eliminar(getId(req))
      res.status(204).send()
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async cambiarEstado(req: Request, res: Response) {
    try {
      const propiedad = await propiedadService.cambiarEstado(getId(req), req.body.estado)
      res.json(propiedad)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }
}