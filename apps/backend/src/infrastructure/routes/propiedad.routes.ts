import { Router } from 'express'
import { PropiedadController } from '../controllers/PropiedadController'
import { PropiedadService } from '../../application/services/PropiedadService'
import { PropiedadRepository } from '../repositories/PropiedadRepository'
import { ImagenService } from '../../application/services/ImagenService'
import { ImagenRepository } from '../repositories/ImagenRepository'
import { CloudinaryUploadService } from '../cloudinary/CloudinaryUploadService'
import { AuthorizationService } from '../../application/services/AuthorizationService'
import { requireAuth } from '../middlewares/authMiddleware'

const cloudinaryUpload = new CloudinaryUploadService()
const propiedadRepository = new PropiedadRepository()
const imagenRepository = new ImagenRepository()
const imagenService = new ImagenService(imagenRepository, cloudinaryUpload)
const authService = new AuthorizationService()
const propiedadService = new PropiedadService(propiedadRepository, imagenService, authService)
const controller = new PropiedadController(propiedadService)

const router = Router()

router.get('/propiedades', controller.listar)
router.get('/propiedades/destacadas', controller.listarDestacadas)
router.get('/propiedades/mias', requireAuth, controller.listarMias)
router.get('/propiedades/:id', controller.obtenerPorId)
router.post('/propiedades', requireAuth, controller.crear)
router.put('/propiedades/:id', requireAuth, controller.actualizar)
router.delete('/propiedades/:id', requireAuth, controller.eliminar)
router.patch('/propiedades/:id/estado', requireAuth, controller.cambiarEstado)

export { router as propiedadRouter }