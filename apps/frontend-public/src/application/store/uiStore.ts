import { create } from 'zustand'

interface UIState {
  sidebarAbierto: boolean
  panelAbierto: boolean
  toggleSidebar: () => void
  cerrarSidebar: () => void
  abrirSidebar: () => void
  togglePanel: () => void
  cerrarPanel: () => void
  abrirPanel: () => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarAbierto: false,
  panelAbierto: false,
  toggleSidebar: () => set((state) => ({ sidebarAbierto: !state.sidebarAbierto })),
  cerrarSidebar: () => set({ sidebarAbierto: false }),
  abrirSidebar: () => set({ sidebarAbierto: true }),
  togglePanel: () => set((state) => ({ panelAbierto: !state.panelAbierto })),
  cerrarPanel: () => set({ panelAbierto: false }),
  abrirPanel: () => set({ panelAbierto: true }),
}))