import { Router } from 'express'
import { AsesorController } from '../controllers/AsesorController'

const router = Router()

router.get('/asesores', AsesorController.listar)
router.get('/asesores/:id', AsesorController.obtenerPorId)
router.post('/asesores', AsesorController.crear)
router.put('/asesores/:id', AsesorController.actualizar)
router.delete('/asesores/:id', AsesorController.eliminar)

export { router as asesorRouter }