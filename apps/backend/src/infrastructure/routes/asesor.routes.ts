import { Router } from 'express'
import { AsesorController } from '../controllers/AsesorController'
import { AsesorService } from '../../application/services/AsesorService'
import { AsesorRepository } from '../repositories/AsesorRepository'
import upload from '../middlewares/upload'

const repository = new AsesorRepository()
const service = new AsesorService(repository)
const controller = new AsesorController(service)

const router = Router()

router.get('/asesores', controller.listar)
router.get('/asesores/:id', controller.obtenerPorId)
router.post('/asesores', controller.crear)
router.put('/asesores/:id', controller.actualizar)
router.delete('/asesores/:id', controller.eliminar)
router.post('/asesores/:id/foto', upload.single('foto'), controller.subirFoto)

export { router as asesorRouter }
