import { Asesor } from '@/domain/entities/Asesor'

export function mapAsesorFromAPI(raw: any): Asesor {
  return {
    id: raw.id,
    nombre: raw.nombre,
    apellido: '',
    email: raw.user?.email ?? '',
    telefono: raw.telefono,
    fotografia: raw.foto ?? '',
    especialidad: raw.especialidad ?? '',
    experiencia: raw.añosExperiencia ?? 0,
    creadoEn: new Date(raw.createdAt),
    descripcion: raw.descripcion ?? '',
    propiedadesCount: raw._count?.propiedades ?? 0,
    rol: raw.user?.rol,
  }
}

export function mapAsesoresLista(rawData: any[]): Asesor[] {
  return rawData.map(mapAsesorFromAPI)
}
