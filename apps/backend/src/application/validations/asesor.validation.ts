import { z } from 'zod'

export const createAsesorSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido').max(100),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  telefono: z.string().min(1, 'Teléfono requerido'),
  foto: z.string().url('URL inválida').optional(),
  especialidad: z.string().optional(),
  descripcion: z.string().optional(),
  añosExperiencia: z.number().int().nonnegative().optional(),
  rol: z.enum(['asesor', 'admin']).optional().default('asesor'),
})

export const updateAsesorSchema = z.object({
  nombre: z.string().min(1).max(100).optional(),
  telefono: z.string().min(1).optional(),
  foto: z.string().url('URL inválida').optional(),
  especialidad: z.string().optional(),
  descripcion: z.string().optional(),
  añosExperiencia: z.number().int().nonnegative().optional(),
})

export type CreateAsesorInput = z.infer<typeof createAsesorSchema>
export type UpdateAsesorInput = z.infer<typeof updateAsesorSchema>