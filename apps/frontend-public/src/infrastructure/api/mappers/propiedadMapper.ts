import { Propiedad } from '@/domain/entities/Propiedad'

export function mapPropiedadDesdeAPI(raw: any): Propiedad {
  return {
    id: raw.id,
    titulo: raw.titulo,
    descripcion: raw.descripcion,
    precio: raw.precio,
    tipoTransaccion: raw.tipoTransaccion,
    tipoInmueble: raw.tipoPropiedad,
    habitaciones: raw.habitaciones ?? 0,
    banos: raw.banios ?? 0,
    areaTotal: raw.metrajeTotal ?? 0,
    destacada: raw.destacada,
    publicada: raw.estado === 'activa',
    asesorId: raw.asesorId,
    ubicacion: {
      direccion: raw.ubicacion?.direccion ?? '',
      ciudad: raw.ubicacion?.ciudad ?? '',
      latitud: raw.ubicacion?.latitud ?? 0,
      longitud: raw.ubicacion?.longitud ?? 0,
    },
    imagenes: raw.imagenes?.map((i: any) => i.url) ?? [],
    creadoEn: new Date(raw.createdAt),
    asesor: raw.asesor ? {
      id: raw.asesor.id,
      nombre: raw.asesor.nombre,
      telefono: raw.asesor.telefono,
    } : undefined,
  }
}

export function mapPropiedadesLista(rawData: any[]): Propiedad[] {
  return rawData.map(mapPropiedadDesdeAPI)
}

export function mapFiltrosParaAPI(filtros: Record<string, any>): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {}
  if (filtros.tipoTransaccion) params.tipoTransaccion = filtros.tipoTransaccion
  if (filtros.tipoInmueble) params.tipoPropiedad = filtros.tipoInmueble
  if (filtros.precioMin) params.precioMin = filtros.precioMin
  if (filtros.precioMax) params.precioMax = filtros.precioMax
  if (filtros.habitaciones) params.habitaciones = filtros.habitaciones
  if (filtros.ciudad) params.ciudad = filtros.ciudad
  if (filtros.busqueda) params.busqueda = filtros.busqueda
  if (filtros.asesorId) params.asesorId = filtros.asesorId
  return params
}

export function mapPropiedadParaAPI(data: any): any {
  const body: any = {
    titulo: data.titulo,
    descripcion: data.descripcion,
    precio: Number(data.precio),
    tipoPropiedad: data.tipoInmueble || data.tipoPropiedad,
    tipoTransaccion: data.tipoTransaccion,
    habitaciones: data.habitaciones ? Number(data.habitaciones) : undefined,
    banios: data.banos ? Number(data.banos) : undefined,
    parqueos: data.parqueos ? Number(data.parqueos) : undefined,
    metrajeTotal: data.areaTotal ? Number(data.areaTotal) : undefined,
    metrajeConstruido: data.metrajeConstruido ? Number(data.metrajeConstruido) : undefined,
    asesorId: data.asesorId,
    destacada: data.destacada ?? false,
  }

  if (data.ubicacion) {
    body.ubicacion = {
      direccion: data.ubicacion.direccion,
      sector: data.ubicacion.sector,
      ciudad: data.ubicacion.ciudad || 'Guayaquil',
      provincia: data.ubicacion.provincia || 'Guayas',
      latitud: Number(data.ubicacion.latitud) || 0,
      longitud: Number(data.ubicacion.longitud) || 0,
    }
  }

  if (data.imagenes && Array.isArray(data.imagenes)) {
    body.imagenes = data.imagenes.map((url: string, idx: number) => ({
      url,
      publicId: `propiedad_${Date.now()}_${idx}`,
      orden: idx,
    }))
  }

  return body
}
