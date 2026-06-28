import { Request } from 'express'

export function getId(req: Request): string {
  return String(req.params.id)
}

export function getParam(req: Request, param: string): string {
  return String(req.params[param])
}