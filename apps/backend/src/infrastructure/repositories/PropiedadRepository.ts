import prisma from '../database/prisma'
import { IPropiedadRepository } from '../../domain/ports/IPropiedadRepository'

export class PropiedadRepository implements IPropiedadRepository {
  async findAll(filtros = {}) {
    const { precioMin, precioMax, tipoPropiedad, tipoTransaccion, habitaciones, ubicacion,
            asesorId, estado, busqueda, destacada, page = 1, limit = 20 } = filtros as any

    const where: any = {}

    if (precioMin || precioMax) {
      where.precio = {}
      if (precioMin) where.precio.gte = precioMin
      if (precioMax) where.precio.lte = precioMax
    }
    if (tipoPropiedad) where.tipoPropiedad = tipoPropiedad
    if (tipoTransaccion) where.tipoTransaccion = tipoTransaccion
    if (habitaciones) where.habitaciones = habitaciones
    if (asesorId) where.asesorId = asesorId
    if (estado) where.estado = estado
    if (destacada) where.destacada = true
    if (busqueda) {
      where.OR = [
        { titulo: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      prisma.propiedad.findMany({
        where,
        skip,
        take: limit,
        include: { imagenes: { orderBy: { orden: 'asc' } }, ubicacion: true, asesor: { select: { id: true, nombre: true, telefono: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.propiedad.count({ where }),
    ])

    return { data, total, page, limit }
  }

  async findById(id: string) {
    return prisma.propiedad.findUnique({
      where: { id },
      include: { imagenes: { orderBy: { orden: 'asc' } }, ubicacion: true, asesor: { select: { id: true, nombre: true, telefono: true } }, mensajes: true },
    })
  }

  async findByAsesorId(asesorId: string) {
    return prisma.propiedad.findMany({
      where: { asesorId },
      include: { imagenes: { orderBy: { orden: 'asc' } }, ubicacion: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findDestacadas(limit = 6) {
    return prisma.propiedad.findMany({
      where: { destacada: true, estado: 'activa' },
      take: limit,
      include: { imagenes: { orderBy: { orden: 'asc' }, take: 1 }, ubicacion: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: any) {
    const { ubicacion, ...propiedadData } = data
    return prisma.propiedad.create({
      data: {
        ...propiedadData,
        ubicacion: { create: ubicacion },
      },
      include: { imagenes: true, ubicacion: true, asesor: { select: { id: true, nombre: true, telefono: true } } },
    })
  }

  async update(id: string, data: any) {
    const { ubicacion, ...propiedadData } = data
    return prisma.propiedad.update({
      where: { id },
      data: {
        ...propiedadData,
        ...(ubicacion ? { ubicacion: { update: ubicacion } } : {}),
      },
      include: { imagenes: true, ubicacion: true, asesor: { select: { id: true, nombre: true, telefono: true } } },
    })
  }

  async delete(id: string) {
    await prisma.propiedad.delete({ where: { id } })
  }

  async countByAsesorId(asesorId: string) {
    return prisma.propiedad.count({ where: { asesorId } })
  }
}
