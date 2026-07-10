import { Router } from 'express'
import { AsesorController } from '../controllers/AsesorController'
import { AsesorService } from '../../application/services/AsesorService'
import { AsesorRepository } from '../repositories/AsesorRepository'
import { BcryptPasswordHasher } from '../auth/BcryptPasswordHasher'
import { CloudinaryUploadService } from '../cloudinary/CloudinaryUploadService'
import upload from '../middlewares/upload'
import { requireAuth, requireRol } from '../middlewares/authMiddleware'

const repository = new AsesorRepository()
const passwordHasher = new BcryptPasswordHasher()
const cloudinaryUpload = new CloudinaryUploadService()
const service = new AsesorService(repository, passwordHasher, cloudinaryUpload)
const controller = new AsesorController(service)

const router = Router()

router.get('/asesores', controller.listar)
router.get('/asesores/admin', requireAuth, requireRol('admin'), controller.listarAdmin)
router.get('/asesores/:id', controller.obtenerPorId)
router.post('/asesores', requireAuth, requireRol('admin'), controller.crear)
router.put('/asesores/:id', requireAuth, async (req, res, next) => {
  const user = req.user
  if (user?.rol !== 'admin' && user?.asesorId !== req.params.id) {
    return res.status(403).json({ message: 'No tienes permisos para esta acción' })
  }
  next()
}, controller.actualizar)
router.delete('/asesores/:id', requireAuth, requireRol('admin'), controller.eliminar)
router.post('/asesores/:id/foto', upload.single('foto'), controller.subirFoto)

export { router as asesorRouter }