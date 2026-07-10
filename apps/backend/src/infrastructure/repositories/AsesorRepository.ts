import prisma from '../database/prisma'
import { IAsesorRepository } from '../../domain/ports/IAsesorRepository'
import { AppError } from '../../application/services/AppError'

export class AsesorRepository implements IAsesorRepository {
  async findAll() {
    return prisma.asesor.findMany({
      include: {
        user: { select: { email: true, rol: true, activo: true } },
        _count: { select: { propiedades: true, mensajes: true } },
      },
    })
  }

  async findAllPublic() {
    return prisma.asesor.findMany({
      where: { user: { rol: { not: 'admin' } } },
      include: {
        user: { select: { email: true, rol: true, activo: true } },
        _count: { select: { propiedades: true, mensajes: true } },
      },
    })
  }

  async findById(id: string) {
    return prisma.asesor.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, rol: true, activo: true } },
        _count: { select: { propiedades: true, mensajes: true } },
      },
    })
  }

  async findByEmail(email: string) {
    return prisma.asesor.findFirst({
      where: { user: { email } },
      include: { user: true },
    })
  }

  async create(data: any) {
    const { email, password, rol, ...asesorData } = data
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, password, rol: rol || 'asesor' },
      })
      return tx.asesor.create({
        data: { ...asesorData, userId: user.id },
        include: { user: { select: { email: true, rol: true } } },
      })
    })
  }

  async update(id: string, data: Record<string, unknown>) {
    const { email, password, ...asesorData } = data
    const userUpdateData: Record<string, unknown> = {}
    if (email) userUpdateData.email = email
    if (password) userUpdateData.password = password

    return prisma.$transaction(async (tx) => {
      if (Object.keys(userUpdateData).length > 0) {
        const asesor = await tx.asesor.findUnique({ where: { id } })
        if (asesor) {
          await tx.user.update({ where: { id: asesor.userId }, data: userUpdateData })
        }
      }
      return tx.asesor.update({
        where: { id },
        data: asesorData as any,
        include: { user: { select: { email: true, rol: true } } },
      })
    })
  }

  async delete(id: string) {
    const asesor = await prisma.asesor.findUnique({ where: { id } })
    if (!asesor) throw new AppError(404, 'Asesor no encontrado')
    await prisma.$transaction([
      prisma.mensaje.deleteMany({ where: { asesorId: id } }),
      prisma.propiedad.deleteMany({ where: { asesorId: id } }),
      prisma.asesor.delete({ where: { id } }),
      prisma.user.delete({ where: { id: asesor.userId } }),
    ])
  }
}