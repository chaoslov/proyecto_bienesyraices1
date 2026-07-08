import { Router } from 'express'
import { MensajeController } from '../controllers/MensajeController'
import { MensajeService } from '../../application/services/MensajeService'
import { MensajeRepository } from '../repositories/MensajeRepository'
import { requireAuth } from '../middlewares/authMiddleware'

const repository = new MensajeRepository()
const service = new MensajeService(repository)
const controller = new MensajeController(service)

const router = Router()

router.post('/mensajes', controller.crear)
router.get('/mensajes', requireAuth, controller.listarMios)
router.patch('/mensajes/:id/leer', requireAuth, controller.marcarLeido)
router.patch('/mensajes/:id/archivar', requireAuth, controller.archivar)
router.delete('/mensajes/:id', requireAuth, controller.eliminar)

export { router as mensajeRouter }