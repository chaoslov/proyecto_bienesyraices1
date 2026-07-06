import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type EstadoChat = 'listo' | 'procesando' | 'error' | 'rateLimit'
export type RolMensaje = 'usuario' | 'asistente'

export interface ChatMensaje {
  id: string
  rol: RolMensaje
  contenido: string
  timestamp: number
  esCargando?: boolean
}

interface ChatbotState {
  estaAbierto: boolean
  estado: EstadoChat
  mensajeError: string | null
  mensajes: ChatMensaje[]
  estaEscribiendo: boolean

  toggleChat: () => void
  setChatAbierto: (v: boolean) => void
  setEstado: (e: EstadoChat) => void
  setError: (msg: string) => void
  limpiarError: () => void
  agregarMensaje: (rol: RolMensaje, contenido: string, opts?: { esCargando?: boolean }) => string
  actualizarMensaje: (id: string, cambios: Partial<ChatMensaje>) => void
  eliminarMensaje: (id: string) => void
  setEstaEscribiendo: (v: boolean) => void
  reiniciarChat: () => void
}

function uid(): string {
  return `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

export const useChatbotStore = create<ChatbotState>()(
  devtools(
    (set) => ({
      estaAbierto: false,
      estado: 'listo',
      mensajeError: null,
      mensajes: [],
      estaEscribiendo: false,

      toggleChat: () => set((s) => ({ estaAbierto: !s.estaAbierto })),
      setChatAbierto: (v) => set({ estaAbierto: v }),
      setEstado: (e) => set({ estado: e }),
      setError: (msg) => set({ estado: 'error', mensajeError: msg }),
      limpiarError: () => set({ estado: 'listo', mensajeError: null }),

      agregarMensaje: (rol, contenido, opts = {}) => {
        const id = uid()
        set((s) => ({
          mensajes: [
            ...s.mensajes,
            { id, rol, contenido, timestamp: Date.now(), esCargando: opts.esCargando ?? false },
          ],
        }))
        return id
      },

      actualizarMensaje: (id, cambios) =>
        set((s) => ({
          mensajes: s.mensajes.map((m) => (m.id === id ? { ...m, ...cambios } : m)),
        })),

      eliminarMensaje: (id) =>
        set((s) => ({ mensajes: s.mensajes.filter((m) => m.id !== id) })),

      setEstaEscribiendo: (v) => set({ estaEscribiendo: v }),

      reiniciarChat: () =>
        set({ mensajes: [], mensajeError: null, estado: 'listo' }),
    }),
    { name: 'ChatbotStore' },
  ),
)

export const selectPuedeEscribir = (s: ChatbotState): boolean =>
  s.estado === 'listo' && !s.estaEscribiendo
