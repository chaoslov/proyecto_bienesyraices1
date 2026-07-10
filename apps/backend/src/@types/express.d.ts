import { TokenPayload } from '../domain/ports/ITokenService'

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload
    }
  }
}