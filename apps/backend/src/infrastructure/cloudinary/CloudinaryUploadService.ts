import cloudinary from './config'
import { IFileUploadService } from '../../domain/ports/IFileUploadService'

export class CloudinaryUploadService implements IFileUploadService {
  async upload(file: Express.Multer.File, folder = 'alpha-inmobiliaria') {
    return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string; public_id: string })
        },
      )
      stream.end(file.buffer)
    })
  }

  async destroy(publicId: string) {
    await cloudinary.uploader.destroy(publicId)
  }
}