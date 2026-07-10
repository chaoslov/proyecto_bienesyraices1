import { Router } from 'express'
import { ImagenController } from '../controllers/ImagenController'
import { ImagenService } from '../../application/services/ImagenService'
import { ImagenRepository } from '../repositories/ImagenRepository'
import { CloudinaryUploadService } from '../cloudinary/CloudinaryUploadService'
import upload from '../middlewares/upload'

const repository = new ImagenRepository()
const cloudinaryUpload = new CloudinaryUploadService()
const service = new ImagenService(repository, cloudinaryUpload)
const controller = new ImagenController(service)

const router = Router()

router.post('/propiedades/:id/imagenes', upload.single('imagen'), controller.subir)
router.post('/propiedades/:id/imagenes/multiples', upload.array('imagenes', 10), controller.subirMultiples)
router.delete('/imagenes/:id', controller.eliminar)

export { router as imagenRouter }