import prisma from '../database/prisma'
import { IUserRepository } from '../../domain/ports/IUserRepository'

export class UserRepository implements IUserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { asesor: true },
    })
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { asesor: true },
    })
  }
}