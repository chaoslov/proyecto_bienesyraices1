import { Request, Response, NextFunction } from 'express'
import { JwtTokenService } from '../auth/JwtTokenService'

const tokenService = new JwtTokenService()

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = header.split(' ')[1]

  try {
    req.user = tokenService.verify(token)
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export function requireRol(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción' })
    }
    next()
  }
}

export function getAsesorId(req: Request): string {
  if (!req.user?.asesorId) {
    throw { status: 403, message: 'Acción solo para asesores' }
  }
  return req.user.asesorId
}
