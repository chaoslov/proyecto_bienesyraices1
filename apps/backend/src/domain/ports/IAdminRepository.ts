export interface IAdminRepository {
  findById(id: string): Promise<any | null>
  findByUserId(userId: string): Promise<any | null>
}
