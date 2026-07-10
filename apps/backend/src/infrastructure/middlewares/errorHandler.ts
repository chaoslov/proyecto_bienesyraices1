import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../../application/services/AppError'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const msgs = err.issues.map((i) => i.message).join(', ')
    return res.status(400).json({ message: msgs })
  }

  if (err instanceof AppError) {
    const response: Record<string, unknown> = { message: err.message }
    if (err.errors) response.errors = err.errors
    return res.status(err.status).json(response)
  }

  const typedErr = err as { status?: number; message?: string; errors?: unknown }
  if (typedErr?.status) {
    const response: Record<string, unknown> = { message: typedErr.message || 'Error interno' }
    if (typedErr.errors) response.errors = typedErr.errors
    return res.status(typedErr.status).json(response)
  }

  console.error('Error no manejado:', err)
  return res.status(500).json({ message: 'Error interno del servidor' })
}