import { api } from '../api/httpClient'

export const uploadService = {
  async subirImagenesPropiedad(propiedadId: string, files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((f) => formData.append('imagenes', f))

    const data = await api.postForm<string[]>(`/propiedades/${propiedadId}/imagenes/multiples`, formData)
    return data.map((img: any) => img.url)
  },

  async subirFotoAsesor(asesorId: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('foto', file)

    const data = await api.postForm<{ foto: string }>(`/asesores/${asesorId}/foto`, formData)
    return data.foto
  },
}