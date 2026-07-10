import { IUserRepository } from '../../domain/ports/IUserRepository'
import { IPasswordHasher } from '../../domain/ports/IPasswordHasher'
import { ITokenService } from '../../domain/ports/ITokenService'
import { loginSchema } from '../validations/auth.validation'
import { AppError } from './AppError'

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private tokenService: ITokenService,
  ) {}

  async login(data: unknown) {
    const { email, password } = loginSchema.parse(data)
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new AppError(401, 'Credenciales inválidas')
    if (!user.activo) throw new AppError(401, 'Usuario desactivado')

    const passwordValido = await this.passwordHasher.compare(password, user.password)
    if (!passwordValido) throw new AppError(401, 'Credenciales inválidas')

    const token = this.tokenService.sign({
      id: user.id,
      email: user.email,
      rol: user.rol,
      asesorId: user.asesor?.id || null,
      adminId: user.admin?.id || null,
    })

    const { password: _, ...userSinPassword } = user
    return { token, user: userSinPassword }
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new AppError(404, 'Usuario no encontrado')
    const { password: _, ...userSinPassword } = user
    return userSinPassword
  }
}