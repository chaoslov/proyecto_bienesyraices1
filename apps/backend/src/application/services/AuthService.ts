import { IUserRepository } from '../../domain/ports/IUserRepository'
import { loginSchema } from '../validations/auth.validation'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { ZodError } from 'zod'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  async login(data: any) {
    try {
      const { email, password } = loginSchema.parse(data)

      const user = await this.userRepository.findByEmail(email)
      if (!user) throw { status: 401, message: 'Credenciales inválidas' }
      if (!user.activo) throw { status: 401, message: 'Usuario desactivado' }

      const passwordValido = await bcrypt.compare(password, user.password)
      if (!passwordValido) throw { status: 401, message: 'Credenciales inválidas' }

      const token = jwt.sign(
        { id: user.id, email: user.email, rol: user.rol, asesorId: user.asesor?.id || null },
        JWT_SECRET,
        { expiresIn: '7d' },
      )

      const { password: _, ...userSinPassword } = user

      return { token, user: userSinPassword }
    } catch (error) {
      if (error instanceof ZodError) {
        throw { status: 400, message: 'Datos inválidos', errors: error.issues }
      }
      throw error
    }
  }

  async me(userId: string) {
    const user = await this.userRepository.findById(userId)
    if (!user) throw { status: 404, message: 'Usuario no encontrado' }

    const { password: _, ...userSinPassword } = user
    return userSinPassword
  }
}