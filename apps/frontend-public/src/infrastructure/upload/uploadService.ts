const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const uploadService = {
  async subirImagenesPropiedad(propiedadId: string, files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((f) => formData.append('imagenes', f))

    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/propiedades/${propiedadId}/imagenes/multiples`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error al subir imágenes' }))
      throw new Error(err.message)
    }

    const data = await res.json()
    return data.map((img: any) => img.url)
  },

  async subirFotoAsesor(asesorId: string, file: File): Promise<string> {
    const formData = new FormData()
    formData.append('foto', file)

    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/asesores/${asesorId}/foto`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Error al subir foto' }))
      throw new Error(err.message)
    }

    const data = await res.json()
    return data.foto
  },
}