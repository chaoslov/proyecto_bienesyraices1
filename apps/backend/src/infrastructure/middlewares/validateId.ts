import { Request } from 'express'

export function getId(req: Request): string {
  return String(req.params.id)
}
