import prisma from '../database/prisma'
import { IMensajeRepository } from '../../domain/ports/IMensajeRepository'

export class MensajeRepository implements IMensajeRepository {
  async findAllByAsesorId(asesorId: string, filtros?: { leido?: boolean; archivado?: boolean }) {
    const where: any = { asesorId }
    if (filtros?.leido !== undefined) where.leido = filtros.leido
    if (filtros?.archivado !== undefined) where.archivado = filtros.archivado
    return prisma.mensaje.findMany({
      where,
      include: { propiedad: { select: { id: true, titulo: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findAllAdmin(filtros?: { tipo?: string; leido?: boolean; archivado?: boolean }) {
    const where: any = {
      OR: [
        { estadoAsignacion: null },
        { estadoAsignacion: 'rechazado' },
      ],
    }
    if (filtros?.tipo !== undefined) where.tipo = filtros.tipo
    if (filtros?.leido !== undefined) where.leido = filtros.leido
    if (filtros?.archivado !== undefined) where.archivado = filtros.archivado
    return prisma.mensaje.findMany({
      where,
      include: {
        propiedad: { select: { id: true, titulo: true } },
        asesor: { select: { id: true, nombre: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string) {
    return prisma.mensaje.findUnique({
      where: { id },
      include: { propiedad: { select: { id: true, titulo: true } }, asesor: { select: { id: true, nombre: true } } },
    })
  }

  async create(data: any) {
    return prisma.mensaje.create({
      data,
      include: { propiedad: { select: { id: true, titulo: true } } },
    })
  }

  async update(id: string, data: any) {
    return prisma.mensaje.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    await prisma.mensaje.delete({ where: { id } })
  }

  async countNoLeidos(asesorId: string) {
    return prisma.mensaje.count({ where: { asesorId, leido: false } })
  }
}