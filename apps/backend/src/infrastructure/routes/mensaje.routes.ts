import { Router } from 'express'
import { MensajeController } from '../controllers/MensajeController'
import { MensajeService } from '../../application/services/MensajeService'
import { MensajeRepository } from '../repositories/MensajeRepository'
import { AuthorizationService } from '../../application/services/AuthorizationService'
import { requireAuth, requireRol } from '../middlewares/authMiddleware'

const repository = new MensajeRepository()
const authService = new AuthorizationService()
const service = new MensajeService(repository, authService)
const controller = new MensajeController(service)

const router = Router()

router.post('/mensajes', controller.crear)
router.get('/mensajes', requireAuth, controller.listarMios)
router.get('/mensajes/admin', requireAuth, requireRol('admin'), controller.listarTodos)
router.patch('/mensajes/:id/leer', requireAuth, controller.marcarLeido)
router.patch('/mensajes/:id/archivar', requireAuth, controller.archivar)
router.patch('/mensajes/:id/asignar', requireAuth, requireRol('admin'), controller.asignar)
router.patch('/mensajes/:id/aceptar', requireAuth, controller.aceptar)
router.patch('/mensajes/:id/rechazar', requireAuth, controller.rechazar)
router.delete('/mensajes/:id', requireAuth, controller.eliminar)

export { router as mensajeRouter }