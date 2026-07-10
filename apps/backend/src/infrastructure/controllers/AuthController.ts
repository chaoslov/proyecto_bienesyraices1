import { Request, Response, NextFunction } from 'express'
import { AuthService } from '../../application/services/AuthService'

export class AuthController {
  constructor(private service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.login(req.body)
      res.json(result)
    } catch (error) {
      next(error)
    }
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.me(req.user!.id)
      res.json(user)
    } catch (error) {
      next(error)
    }
  }
}