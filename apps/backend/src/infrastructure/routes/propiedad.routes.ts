import { Router } from 'express'
import { PropiedadController } from '../controllers/PropiedadController'
import { PropiedadService } from '../../application/services/PropiedadService'
import { PropiedadRepository } from '../repositories/PropiedadRepository'
import { ImagenService } from '../../application/services/ImagenService'
import { ImagenRepository } from '../repositories/ImagenRepository'
import { requireAuth } from '../middlewares/authMiddleware'

const propiedadRepository = new PropiedadRepository()
const imagenRepository = new ImagenRepository()
const imagenService = new ImagenService(imagenRepository)
const service = new PropiedadService(propiedadRepository, imagenService)
const controller = new PropiedadController(service)

const router = Router()

router.get('/propiedades', controller.listar)
router.get('/propiedades/destacadas', controller.listarDestacadas)
router.get('/propiedades/:id', controller.obtenerPorId)
router.get('/propiedades/mias', requireAuth, controller.listarMias)
router.post('/propiedades', requireAuth, controller.crear)
router.put('/propiedades/:id', requireAuth, controller.actualizar)
router.delete('/propiedades/:id', requireAuth, controller.eliminar)
router.patch('/propiedades/:id/estado', requireAuth, controller.cambiarEstado)

export { router as propiedadRouter }
