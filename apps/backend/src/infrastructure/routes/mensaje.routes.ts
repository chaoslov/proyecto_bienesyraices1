import { Router } from 'express'
import { MensajeController } from '../controllers/MensajeController'
import { MensajeService } from '../../application/services/MensajeService'
import { MensajeRepository } from '../repositories/MensajeRepository'

const repository = new MensajeRepository()
const service = new MensajeService(repository)
const controller = new MensajeController(service)

const router = Router()

router.post('/mensajes', controller.crear)
router.get('/mensajes/asesor/:asesorId', controller.listarPorAsesor)
router.patch('/mensajes/:id/leer', controller.marcarLeido)
router.patch('/mensajes/:id/archivar', controller.archivar)
router.delete('/mensajes/:id', controller.eliminar)

export { router as mensajeRouter }