import { Request, Response } from 'express'
import { AsesorService } from '../../application/services/AsesorService'
import { getId } from '../middlewares/validateId'

export class AsesorController {
  constructor(private service: AsesorService) {}

  listar = async (_req: Request, res: Response) => {
    try {
      const asesores = await this.service.listar()
      res.json(asesores)
    } catch (error: any) {
      res.status(500).json({ message: 'Error al listar asesores' })
    }
  }

  obtenerPorId = async (req: Request, res: Response) => {
    try {
      const asesor = await this.service.obtenerPorId(getId(req))
      res.json(asesor)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  crear = async (req: Request, res: Response) => {
    try {
      const asesor = await this.service.crear(req.body)
      res.status(201).json(asesor)
    } catch (error: any) {
      if (error.issues) return res.status(400).json({ message: 'Datos inválidos', errors: error.issues })
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  actualizar = async (req: Request, res: Response) => {
    try {
      const asesor = await this.service.actualizar(getId(req), req.body)
      res.json(asesor)
    } catch (error: any) {
      if (error.issues) return res.status(400).json({ message: 'Datos inválidos', errors: error.issues })
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  eliminar = async (req: Request, res: Response) => {
    try {
      await this.service.eliminar(getId(req))
      res.status(204).send()
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  subirFoto = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Archivo de foto requerido' })
      }
      const asesor = await this.service.subirFoto(getId(req), req.file)
      res.json(asesor)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error al subir foto' })
    }
  }
}
