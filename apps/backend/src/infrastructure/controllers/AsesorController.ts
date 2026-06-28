import { Request, Response } from 'express'
import { asesorService } from '../../application/services/AsesorService'
import { getId } from '../middlewares/validateId'

export class AsesorController {
  static async listar(_req: Request, res: Response) {
    try {
      const asesores = await asesorService.listar()
      res.json(asesores)
    } catch (error: any) {
      res.status(500).json({ message: 'Error al listar asesores' })
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const asesor = await asesorService.obtenerPorId(getId(req))
      res.json(asesor)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const asesor = await asesorService.crear(req.body)
      res.status(201).json(asesor)
    } catch (error: any) {
      if (error.issues) return res.status(400).json({ message: 'Datos inválidos', errors: error.issues })
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const asesor = await asesorService.actualizar(getId(req), req.body)
      res.json(asesor)
    } catch (error: any) {
      if (error.issues) return res.status(400).json({ message: 'Datos inválidos', errors: error.issues })
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      await asesorService.eliminar(getId(req))
      res.status(204).send()
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }
}