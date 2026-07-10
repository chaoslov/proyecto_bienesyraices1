import prisma from '../database/prisma'
import { IAdminRepository } from '../../domain/ports/IAdminRepository'

export class AdminRepository implements IAdminRepository {
  async findById(id: string) {
    return prisma.admin.findUnique({ where: { id } })
  }

  async findByUserId(userId: string) {
    return prisma.admin.findUnique({ where: { userId } })
  }
}
