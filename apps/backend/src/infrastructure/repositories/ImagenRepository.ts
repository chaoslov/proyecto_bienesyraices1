import prisma from '../database/prisma'
import { IImagenRepository } from '../../domain/ports/IImagenRepository'

export class ImagenRepository implements IImagenRepository {
  async findAllByPropiedadId(propiedadId: string) {
    return prisma.imagen.findMany({
      where: { propiedadId },
      orderBy: { orden: 'asc' },
    })
  }

  async findById(id: string) {
    return prisma.imagen.findUnique({ where: { id } })
  }

  async create(data: { url: string; publicId: string; orden: number; propiedadId: string }) {
    return prisma.imagen.create({ data })
  }

  async createMany(data: { url: string; publicId: string; orden: number; propiedadId: string }[]) {
    return prisma.imagen.createMany({ data })
  }

  async delete(id: string) {
    await prisma.imagen.delete({ where: { id } })
  }
}