export interface IUserRepository {
  findByEmail(email: string): Promise<any | null>
  findById(id: string): Promise<any | null>
}