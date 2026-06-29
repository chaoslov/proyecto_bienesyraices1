import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { AuthService } from '../../application/services/AuthService'
import { UserRepository } from '../repositories/UserRepository'
import { requireAuth } from '../middlewares/authMiddleware'

const repository = new UserRepository()
const service = new AuthService(repository)
const controller = new AuthController(service)

const router = Router()

router.post('/auth/login', controller.login)
router.get('/auth/me', requireAuth, controller.me)

export { router as authRouter }