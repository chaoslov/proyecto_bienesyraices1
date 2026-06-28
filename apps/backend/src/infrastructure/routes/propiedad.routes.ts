import { Router } from 'express'
import { PropiedadController } from '../controllers/PropiedadController'

const router = Router()

router.get('/propiedades', PropiedadController.listar)
router.get('/propiedades/destacadas', PropiedadController.listarDestacadas)
router.get('/propiedades/:id', PropiedadController.obtenerPorId)
router.post('/propiedades', PropiedadController.crear)
router.put('/propiedades/:id', PropiedadController.actualizar)
router.delete('/propiedades/:id', PropiedadController.eliminar)
router.patch('/propiedades/:id/estado', PropiedadController.cambiarEstado)

export { router as propiedadRouter }