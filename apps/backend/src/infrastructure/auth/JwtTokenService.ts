import jwt from 'jsonwebtoken'
import { ITokenService, TokenPayload } from '../../domain/ports/ITokenService'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export class JwtTokenService implements ITokenService {
  sign(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  }

  verify(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  }
}