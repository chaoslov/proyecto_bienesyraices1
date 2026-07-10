import prisma from '../database/prisma'
import { IPropiedadRepository } from '../../domain/ports/IPropiedadRepository'

export class PropiedadRepository implements IPropiedadRepository {
  async findAll(filtros: Record<string, unknown> = {}) {
    const { precioMin, precioMax, tipoPropiedad, tipoTransaccion, habitaciones, banios, parqueos,
      sector, ciudad, asesorId, estado, busqueda, destacada,
      metrajeMin, metrajeMax, ordenarPor, ordenDireccion, page = 1, limit = 20 } = filtros as any

    const where: any = {}

    if (precioMin || precioMax) {
      where.precio = {}
      if (precioMin) where.precio.gte = precioMin
      if (precioMax) where.precio.lte = precioMax
    }
    if (tipoPropiedad) where.tipoPropiedad = tipoPropiedad
    if (tipoTransaccion) where.tipoTransaccion = tipoTransaccion
    if (habitaciones) where.habitaciones = habitaciones
    if (banios) where.banios = banios
    if (parqueos) where.parqueos = parqueos
    if (asesorId) where.asesorId = asesorId
    if (estado) {
      where.estado = estado
    } else if (!asesorId) {
      where.estado = 'activa'
    }
    if (destacada) where.destacada = true

    if (metrajeMin || metrajeMax) {
      where.metrajeTotal = {}
      if (metrajeMin) where.metrajeTotal.gte = metrajeMin
      if (metrajeMax) where.metrajeTotal.lte = metrajeMax
    }

    if (sector || ciudad) {
      where.ubicacion = {}
      if (sector) where.ubicacion.sector = { contains: sector, mode: 'insensitive' }
      if (ciudad) where.ubicacion.ciudad = { contains: ciudad, mode: 'insensitive' }
    }

    if (busqueda) {
      where.OR = [
        { titulo: { contains: busqueda, mode: 'insensitive' } },
        { descripcion: { contains: busqueda, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * limit

    const orderBy: any = {}
    if (ordenarPor) {
      orderBy[ordenarPor] = ordenDireccion || 'desc'
    } else {
      orderBy.createdAt = 'desc'
    }

    const [data, total] = await Promise.all([
      prisma.propiedad.findMany({
        where,
        skip,
        take: limit,
        include: { imagenes: { orderBy: { orden: 'asc' } }, ubicacion: true, asesor: { select: { id: true, nombre: true, telefono: true } } },
        orderBy,
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
    const { ubicacion, asesorId, imagenes, ...propiedadData } = data
    return prisma.propiedad.create({
      data: {
        ...propiedadData,
        asesor: { connect: { id: asesorId } },
        ubicacion: { create: ubicacion },
        ...(imagenes ? { imagenes: { create: imagenes } } : {}),
      },
      include: { imagenes: true, ubicacion: true, asesor: { select: { id: true, nombre: true, telefono: true } } },
    })
  }

  async update(id: string, data: any) {
    const { ubicacion, imagenes, ...propiedadData } = data
    return prisma.propiedad.update({
      where: { id },
      data: {
        ...propiedadData,
        ...(ubicacion ? { ubicacion: { update: ubicacion } } : {}),
        ...(imagenes ? { imagenes: { deleteMany: {}, create: imagenes } } : {}),
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