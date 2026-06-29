import { z } from 'zod'

export const createMensajeSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido'),
  telefono: z.string().optional(),
  mensaje: z.string().min(10, 'Mínimo 10 caracteres'),
  tipo: z.enum(['contacto', 'venta']),
  propiedadId: z.string().uuid('ID de propiedad inválido').optional(),
  asesorId: z.string().uuid('ID de asesor inválido'),
})

export type CreateMensajeInput = z.infer<typeof createMensajeSchema>