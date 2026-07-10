export interface UploadResult {
  secure_url: string
  public_id: string
}

export interface IFileUploadService {
  upload(file: Express.Multer.File, folder?: string): Promise<UploadResult>
  destroy(publicId: string): Promise<void>
}