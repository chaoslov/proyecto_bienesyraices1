import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { AuthService } from '../../application/services/AuthService'
import { UserRepository } from '../repositories/UserRepository'
import { BcryptPasswordHasher } from '../auth/BcryptPasswordHasher'
import { JwtTokenService } from '../auth/JwtTokenService'
import { requireAuth } from '../middlewares/authMiddleware'

const userRepo = new UserRepository()
const passwordHasher = new BcryptPasswordHasher()
const tokenService = new JwtTokenService()
const service = new AuthService(userRepo, passwordHasher, tokenService)
const controller = new AuthController(service)

const router = Router()

router.post('/auth/login', controller.login)
router.get('/auth/me', requireAuth, controller.me)

export { router as authRouter }