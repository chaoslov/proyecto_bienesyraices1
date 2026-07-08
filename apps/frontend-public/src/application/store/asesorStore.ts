import { create } from 'zustand'
import { Asesor } from '@/domain/entities/Asesor'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'
import { asesoresMock } from '@/infrastructure/mocks/asesoresMock'

interface AsesorState {
  asesores: Asesor[]
  asesorSeleccionado: Asesor | null
  loading: boolean
  error: string | null
  setAsesores: (asesores: Asesor[]) => void
  setAsesorSeleccionado: (asesor: Asesor | null) => void
  fetchAsesores: () => Promise<void>
}

export const useAsesorStore = create<AsesorState>((set) => ({
  asesores: [],
  asesorSeleccionado: null,
  loading: false,
  error: null,

  setAsesores: (asesores) => set({ asesores }),
  setAsesorSeleccionado: (asesor) => set({ asesorSeleccionado: asesor }),

  fetchAsesores: async () => {
    set({ loading: true, error: null })
    try {
      const asesores = await AsesorApi.listar()
      set({ asesores, loading: false })
    } catch {
      set({ asesores: [], loading: false, error: 'No se pudieron cargar los asesores. Intenta de nuevo más tarde.' })
    }
  },
}))
