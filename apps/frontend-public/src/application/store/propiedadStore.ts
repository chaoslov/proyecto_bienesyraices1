import { create } from 'zustand'
import { Propiedad } from '@/domain/entities/Propiedad'
import { propiedadesMock } from '@/infrastructure/mocks/propiedadesMock'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'

export interface Filtros {
  tipoTransaccion?: 'venta' | 'alquiler'
  tipoInmueble?: string
  precioMin?: number
  precioMax?: number
  habitaciones?: number
  banos?: number
  areaMin?: number
  areaMax?: number
  ciudad?: string
  sector?: string
  busqueda?: string
}

interface PropiedadState {
  propiedades: Propiedad[]
  total: number
  page: number
  filtros: Filtros
  loading: boolean
  error: string | null
  setPropiedades: (props: Propiedad[]) => void
  setFiltros: (filtros: Partial<Filtros>) => void
  aplicarFiltros: () => Propiedad[]
  limpiarFiltros: () => void
  fetchPropiedades: (page?: number) => Promise<void>
  fetchDestacadas: () => Promise<Propiedad[]>
  fetchPorId: (id: string) => Promise<Propiedad | null>
}

export const usePropiedadStore = create<PropiedadState>((set, get) => ({
  propiedades: [],
  total: 0,
  page: 1,
  filtros: {},
  loading: false,
  error: null,

  setPropiedades: (propiedades) => set({ propiedades }),

  setFiltros: (nuevosFiltros) =>
    set((state) => ({
      filtros: { ...state.filtros, ...nuevosFiltros },
    })),

  aplicarFiltros: () => {
    const { propiedades, filtros } = get()
    return propiedades.filter((prop) => {
      if (filtros.tipoTransaccion && prop.tipoTransaccion !== filtros.tipoTransaccion)
        return false
      if (filtros.tipoInmueble && prop.tipoInmueble !== filtros.tipoInmueble)
        return false
      if (filtros.precioMin && prop.precio < filtros.precioMin) return false
      if (filtros.precioMax && prop.precio > filtros.precioMax) return false
      if (filtros.habitaciones && prop.habitaciones < filtros.habitaciones)
        return false
      if (filtros.ciudad && prop.ubicacion.ciudad !== filtros.ciudad)
        return false
      if (filtros.sector && prop.ubicacion.sector !== filtros.sector)
        return false
      if (filtros.banos && prop.banos < filtros.banos)
        return false
      if (filtros.areaMin && prop.areaTotal < filtros.areaMin)
        return false
      if (filtros.areaMax && prop.areaTotal > filtros.areaMax)
        return false
      if (filtros.busqueda) {
        const term = filtros.busqueda.toLowerCase()
        const titulo = prop.titulo.toLowerCase()
        const desc = prop.descripcion.toLowerCase()
        if (!titulo.includes(term) && !desc.includes(term)) return false
      }
      return true
    })
  },

  limpiarFiltros: () => set({ filtros: {} }),

  fetchPropiedades: async (page = 1) => {
    set({ loading: true, error: null })
    const LIMIT = 12
    try {
      const { filtros } = get()
      const result = await PropiedadApi.listar(filtros, 1, 100)
      set({ propiedades: result.data, total: result.total, page: result.page, loading: false })
      const todasFiltradas = get().aplicarFiltros()
      const totalFiltradas = todasFiltradas.length
      const totalPages = Math.ceil(totalFiltradas / LIMIT) || 1
      const safePage = Math.min(page, totalPages)
      const start = (safePage - 1) * LIMIT
      set({
        propiedades: todasFiltradas.slice(start, start + LIMIT),
        total: totalFiltradas,
        page: safePage,
        loading: false,
      })
    } catch (err: any) {
      const mocks = propiedadesMock.filter((p) => p.publicada)
      set({ propiedades: mocks, total: mocks.length, loading: false })
      const todasFiltradas = get().aplicarFiltros()
      const totalFiltradas = todasFiltradas.length
      const totalPages = Math.ceil(totalFiltradas / LIMIT) || 1
      const safePage = Math.min(page, totalPages)
      const start = (safePage - 1) * LIMIT
      set({
        propiedades: todasFiltradas.slice(start, start + LIMIT),
        total: totalFiltradas,
        page: safePage,
        loading: false,
      })
    }
  },

  fetchDestacadas: async () => {
    try {
      const destacadas = await PropiedadApi.destacadas()
      const { propiedades } = get()
      const merged = [...destacadas, ...propiedades.filter((p) => !destacadas.find((d) => d.id === p.id))]
      set({ propiedades: merged })
      return destacadas
    } catch {
      const mocks = propiedadesMock.filter((p) => p.destacada)
      return mocks
    }
  },

  fetchPorId: async (id: string) => {
    try {
      const propiedad = await PropiedadApi.obtenerPorId(id)
      return propiedad
    } catch {
      return propiedadesMock.find((p) => p.id === id) || null
    }
  },
}))
