import { Request, Response } from 'express'
import { AuthService } from '../../application/services/AuthService'

export class AuthController {
  constructor(private service: AuthService) {}

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.service.login(req.body)
      res.json(result)
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ message: error.message, errors: error.errors })
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }

  me = async (req: Request, res: Response) => {
    try {
      const user = await this.service.me((req as any).user.id)
      res.json(user)
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message || 'Error interno' })
    }
  }
}