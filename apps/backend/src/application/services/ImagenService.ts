import { IImagenRepository } from '../../domain/ports/IImagenRepository'
import { uploadToCloudinary, destroyFromCloudinary } from '../../infrastructure/cloudinary/upload'

export class ImagenService {
  constructor(private repository: IImagenRepository) {}

  async subir(propiedadId: string, file: Express.Multer.File) {
    const result = await uploadToCloudinary(file)
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
    const results = await Promise.all(files.map(f => uploadToCloudinary(f)))
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

    await destroyFromCloudinary(imagen.publicId)
    await this.repository.delete(id)
  }

  async eliminarPorPropiedadId(propiedadId: string) {
    const imagenes = await this.repository.findAllByPropiedadId(propiedadId)
    if (imagenes.length === 0) return

    await Promise.all(imagenes.map(img => destroyFromCloudinary(img.publicId)))
    await Promise.all(imagenes.map(img => this.repository.delete(img.id)))
  }
}