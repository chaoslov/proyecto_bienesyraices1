import { Request, Response } from 'express'
import { MensajeService } from '../../application/services/MensajeService'
import { getId } from '../middlewares/validateId'

export class MensajeController {
  constructor(private service: MensajeService) {}

  listarPorAsesor = async (req: Request, res: Response) => {
    try {
      const { leido, archivado } = req.query
      const filtros: any = {}
      if (leido !== undefined) filtros.leido = leido === 'true'
      if (archivado !== undefined) filtros.archivado = archivado === 'true'
      const mensajes = await this.service.listarPorAsesor(getId(req), filtros)
      res.json(mensajes)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  crear = async (req: Request, res: Response) => {
    try {
      const mensaje = await this.service.crear(req.body)
      res.status(201).json(mensaje)
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ message: error.message, errors: error.errors })
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  marcarLeido = async (req: Request, res: Response) => {
    try {
      const mensaje = await this.service.marcarLeido(getId(req))
      res.json(mensaje)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  archivar = async (req: Request, res: Response) => {
    try {
      const mensaje = await this.service.archivar(getId(req))
      res.json(mensaje)
    } catch (error: any) {
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
}