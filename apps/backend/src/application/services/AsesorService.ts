import { IAsesorRepository } from '../../domain/ports/IAsesorRepository'
import { IPasswordHasher } from '../../domain/ports/IPasswordHasher'
import { IFileUploadService } from '../../domain/ports/IFileUploadService'
import { createAsesorSchema, updateAsesorSchema } from '../validations/asesor.validation'
import { AppError } from './AppError'
import { validate } from './validate'

export class AsesorService {
  constructor(
    private repository: IAsesorRepository,
    private passwordHasher: IPasswordHasher,
    private fileUploadService: IFileUploadService,
  ) {}

  async listar() { return this.repository.findAll() }

  async listarPublicos() { return this.repository.findAllPublic() }

  async obtenerPorId(id: string) {
    const asesor = await this.repository.findById(id)
    if (!asesor) throw new AppError(404, 'Asesor no encontrado')
    return asesor
  }

  async crear(data: unknown) {
    const validData = validate(createAsesorSchema, data)
    const existente = await this.repository.findByEmail(validData.email)
    if (existente) throw new AppError(400, 'Email ya registrado')
    const hashedPassword = await this.passwordHasher.hash(validData.password)
    return this.repository.create({ ...validData, password: hashedPassword })
  }

  async actualizar(id: string, data: unknown) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Asesor no encontrado')
    const validData = validate(updateAsesorSchema, data) as Record<string, unknown>
    if (validData.password) {
      validData.password = await this.passwordHasher.hash(validData.password as string)
    }
    if (validData.email || validData.password) {
      const { email, password } = validData
      const userUpdate: Record<string, unknown> = {}
      if (email) userUpdate.email = email
      if (password) userUpdate.password = password
      return this.repository.update(id, { ...validData, email: undefined, password: undefined, ...userUpdate })
    }
    return this.repository.update(id, validData)
  }

  async eliminar(id: string) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Asesor no encontrado')
    await this.repository.delete(id)
  }

  async subirFoto(id: string, file: Express.Multer.File) {
    const exists = await this.repository.findById(id)
    if (!exists) throw new AppError(404, 'Asesor no encontrado')
    const result = await this.fileUploadService.upload(file, 'alpha-inmobiliaria/asesores')
    return this.repository.update(id, { foto: result.secure_url })
  }
}