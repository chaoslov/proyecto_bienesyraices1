import { z } from 'zod'

export const createPropiedadSchema = z.object({
  titulo: z.string().min(1, 'Título requerido').max(200),
  descripcion: z.string().min(1, 'Descripción requerida'),
  precio: z.number().positive('Precio debe ser mayor a 0'),
  tipoPropiedad: z.enum(['casa', 'departamento', 'terreno', 'local', 'oficina']),
  tipoTransaccion: z.enum(['venta', 'alquiler']),
  habitaciones: z.number().int().nonnegative().optional(),
  banios: z.number().int().nonnegative().optional(),
  parqueos: z.number().int().nonnegative().optional(),
  metrajeTotal: z.number().positive().optional(),
  metrajeConstruido: z.number().positive().optional(),
  destacada: z.boolean().optional(),
  asesorId: z.string().uuid('ID de asesor inválido'),
  ubicacion: z.object({
    direccion: z.string().min(1, 'Dirección requerida'),
    sector: z.string().optional(),
    ciudad: z.string().optional().default('Guayaquil'),
    provincia: z.string().optional().default('Guayas'),
    latitud: z.number().min(-90).max(90),
    longitud: z.number().min(-180).max(180),
  }),
})

export const updatePropiedadSchema = z.object({
  titulo: z.string().min(1).max(200).optional(),
  descripcion: z.string().min(1).optional(),
  precio: z.number().positive().optional(),
  tipoPropiedad: z.enum(['casa', 'departamento', 'terreno', 'local', 'oficina']).optional(),
  tipoTransaccion: z.enum(['venta', 'alquiler']).optional(),
  habitaciones: z.number().int().nonnegative().optional(),
  banios: z.number().int().nonnegative().optional(),
  parqueos: z.number().int().nonnegative().optional(),
  metrajeTotal: z.number().positive().optional(),
  metrajeConstruido: z.number().positive().optional(),
  estado: z.enum(['activa', 'pausada', 'vendida', 'alquilada']).optional(),
  destacada: z.boolean().optional(),
  ubicacion: z.object({
    direccion: z.string().min(1).optional(),
    sector: z.string().optional(),
    ciudad: z.string().optional(),
    provincia: z.string().optional(),
    latitud: z.number().min(-90).max(90).optional(),
    longitud: z.number().min(-180).max(180).optional(),
  }).optional(),
})

export const filtrosPropiedadSchema = z.object({
  precioMin: z.coerce.number().positive().optional(),
  precioMax: z.coerce.number().positive().optional(),
  tipoPropiedad: z.string().optional(),
  tipoTransaccion: z.enum(['venta', 'alquiler']).optional(),
  habitaciones: z.coerce.number().int().nonnegative().optional(),
  ubicacion: z.string().optional(),
  asesorId: z.string().optional(),
  estado: z.string().optional(),
  busqueda: z.string().optional(),
  destacada: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
})

export type CreatePropiedadInput = z.infer<typeof createPropiedadSchema>
export type UpdatePropiedadInput = z.infer<typeof updatePropiedadSchema>
export type FiltrosPropiedadInput = z.infer<typeof filtrosPropiedadSchema>