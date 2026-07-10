import { ZodError, ZodSchema } from 'zod'
import { AppError } from './AppError'

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      throw new AppError(400, 'Datos inválidos', error.issues)
    }
    throw error
  }
}