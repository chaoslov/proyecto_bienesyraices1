import { Request, Response, NextFunction } from 'express'
import { ImagenService } from '../../application/services/ImagenService'
import { getId } from '../middlewares/validateId'

export class ImagenController {
  constructor(private service: ImagenService) {}

  subir = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Archivo no proporcionado' })
      const imagen = await this.service.subir(getId(req), req.file)
      res.status(201).json(imagen)
    } catch (error) {
      next(error)
    }
  }

  subirMultiples = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.files || !(req.files as Express.Multer.File[]).length) {
        return res.status(400).json({ message: 'Archivos no proporcionados' })
      }
      const imagenes = await this.service.subirMultiples(getId(req), req.files as Express.Multer.File[])
      res.status(201).json(imagenes)
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
}