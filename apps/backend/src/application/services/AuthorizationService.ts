import { AppError } from './AppError'

interface Ownable {
  asesorId: string
}

interface UserInfo {
  id: string
  rol: string
  asesorId: string | null
}

export class AuthorizationService {
  verificarOwnership(propiedad: Ownable, user?: UserInfo, mensajeError = 'No tienes permisos sobre este recurso'): void {
    if (!user) return
    if (user.rol === 'admin') return
    if (propiedad.asesorId !== user.asesorId) {
      throw new AppError(403, mensajeError)
    }
  }
}