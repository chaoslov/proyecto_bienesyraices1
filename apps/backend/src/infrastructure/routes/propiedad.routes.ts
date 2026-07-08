import { Router } from 'express'
import { PropiedadController } from '../controllers/PropiedadController'
import { PropiedadService } from '../../application/services/PropiedadService'
import { PropiedadRepository } from '../repositories/PropiedadRepository'
import { ImagenService } from '../../application/services/ImagenService'
import { ImagenRepository } from '../repositories/ImagenRepository'

const propiedadRepository = new PropiedadRepository()
const imagenRepository = new ImagenRepository()
const imagenService = new ImagenService(imagenRepository)
const service = new PropiedadService(propiedadRepository, imagenService)
const controller = new PropiedadController(service)

const router = Router()

router.get('/propiedades', controller.listar)
router.get('/propiedades/destacadas', controller.listarDestacadas)
router.get('/propiedades/:id', controller.obtenerPorId)
router.post('/propiedades', controller.crear)
router.put('/propiedades/:id', controller.actualizar)
router.delete('/propiedades/:id', controller.eliminar)
router.patch('/propiedades/:id/estado', controller.cambiarEstado)

export { router as propiedadRouter }
