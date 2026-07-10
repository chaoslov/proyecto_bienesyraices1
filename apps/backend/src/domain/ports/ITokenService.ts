export interface TokenPayload {
  id: string
  email: string
  rol: string
  asesorId: string | null
  adminId: string | null
}

export interface ITokenService {
  sign(payload: TokenPayload): string
  verify(token: string): TokenPayload
}