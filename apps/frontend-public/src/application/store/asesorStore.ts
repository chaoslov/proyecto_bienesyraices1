import { create } from 'zustand'
import { Asesor } from '@/domain/entities/Asesor'
import { asesoresMock } from '@/infrastructure/mocks/asesoresMock'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'

interface AsesorState {
  asesores: Asesor[]
  asesorSeleccionado: Asesor | null
  loading: boolean
  setAsesores: (asesores: Asesor[]) => void
  setAsesorSeleccionado: (asesor: Asesor | null) => void
  fetchAsesores: () => Promise<void>
}

export const useAsesorStore = create<AsesorState>((set) => ({
  asesores: [],
  asesorSeleccionado: null,
  loading: false,

  setAsesores: (asesores) => set({ asesores }),
  setAsesorSeleccionado: (asesor) => set({ asesorSeleccionado: asesor }),

  fetchAsesores: async () => {
    set({ loading: true })
    try {
      const asesores = await AsesorApi.listar()
      set({ asesores, loading: false })
    } catch {
      set({ asesores: asesoresMock, loading: false })
    }
  },
}))
