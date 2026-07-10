import { create } from 'zustand'
// 1. Importamos la entidad real del proyecto para que haga match perfecto
import { Propiedad } from '@/domain/entities/Propiedad' 

export interface ChatMensaje {
  id: string
  rol: 'usuario' | 'asistente'
  contenido: string
}

interface ChatbotState {
  estaAbierto: boolean
  estado: 'idle' | 'cargando' | 'error' | 'rateLimit'
  mensajeError: string | null
  mensajes: ChatMensaje[]
  propiedadesFiltradas: Propiedad[]
  filtrosActivos: Record<string, any>
  
  // Acciones
  toggleChat: () => void
  agregarMensaje: (rol: 'usuario' | 'asistente', contenido: string) => void
  setEstado: (estado: 'idle' | 'cargando' | 'error' | 'rateLimit') => void
  setError: (mensaje: string | null) => void
  limpiarError: () => void
  setPropiedadesFiltradas: (propiedades: Propiedad[]) => void
  setFiltrosActivos: (filtros: Record<string, any>) => void
  reiniciarChat: () => void
}

export const useChatbotStore = create<ChatbotState>((set) => ({
  estaAbierto: false,
  estado: 'idle',
  mensajeError: null,
  mensajes: [],
  propiedadesFiltradas: [],
  filtrosActivos: {},

  toggleChat: () => set((state) => ({ estaAbierto: !state.estaAbierto })),

  agregarMensaje: (rol, contenido) =>
    set((state) => ({
      mensajes: [
        ...state.mensajes,
        {
          id: crypto.randomUUID(),
          rol,
          contenido,
        },
      ],
    })),

  setEstado: (estado) => set({ estado }),
  
  setError: (mensajeError) => set({ mensajeError }),
  
  limpiarError: () => set({ estado: 'idle', mensajeError: null }),

  setPropiedadesFiltradas: (propiedades) => set({ propiedadesFiltradas: propiedades }),

  setFiltrosActivos: (filtros) => set({ filtrosActivos: filtros }),

  reiniciarChat: () =>
    set({
      mensajes: [],
      propiedadesFiltradas: [],
      filtrosActivos: {},
      estado: 'idle',
      mensajeError: null,
    }),
}))