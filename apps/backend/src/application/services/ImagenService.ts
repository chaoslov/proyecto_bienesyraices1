import { IImagenRepository } from '../../domain/ports/IImagenRepository'
import cloudinary from '../../infrastructure/cloudinary/config'

export class ImagenService {
  constructor(private repository: IImagenRepository) {}

  async subir(propiedadId: string, file: Express.Multer.File) {
    const result = await this.subirACloudinary(file)
    const ultima = await this.repository.findAllByPropiedadId(propiedadId)
    const orden = ultima.length

    return this.repository.create({
      url: result.secure_url,
      publicId: result.public_id,
      orden,
      propiedadId,
    })
  }

  async subirMultiples(propiedadId: string, files: Express.Multer.File[]) {
    const results = await Promise.all(files.map(f => this.subirACloudinary(f)))
    const existentes = await this.repository.findAllByPropiedadId(propiedadId)

    const data = results.map((r, i) => ({
      url: r.secure_url,
      publicId: r.public_id,
      orden: existentes.length + i,
      propiedadId,
    }))

    await this.repository.createMany(data)
    return this.repository.findAllByPropiedadId(propiedadId)
  }

  async eliminar(id: string) {
    const imagen = await this.repository.findById(id)
    if (!imagen) throw { status: 404, message: 'Imagen no encontrada' }

    await cloudinary.uploader.destroy(imagen.publicId)
    await this.repository.delete(id)
  }

  private async subirACloudinary(file: Express.Multer.File) {
    return new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'alpha-inmobiliaria' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      stream.end(file.buffer)
    })
  }
}