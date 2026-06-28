import prisma from '../database/prisma'

export class AsesorRepository {
  async findAll() {
    return prisma.asesor.findMany({
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

  async update(id: string, data: any) {
    return prisma.asesor.update({
      where: { id },
      data,
      include: { user: { select: { email: true, rol: true } } },
    })
  }

  async delete(id: string) {
    const asesor = await prisma.asesor.findUnique({ where: { id } })
    if (!asesor) throw new Error('Asesor no encontrado')
    await prisma.$transaction([
      prisma.mensaje.deleteMany({ where: { asesorId: id } }),
      prisma.propiedad.deleteMany({ where: { asesorId: id } }),
      prisma.asesor.delete({ where: { id } }),
      prisma.user.delete({ where: { id: asesor.userId } }),
    ])
  }
}

export const asesorRepository = new AsesorRepository()