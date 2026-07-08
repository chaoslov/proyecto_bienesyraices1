import cloudinary from './config'

export function uploadToCloudinary(file: Express.Multer.File, folder = 'alpha-inmobiliaria') {
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

export function destroyFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}
