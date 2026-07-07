import { useEffect, useRef } from 'react'
import { MessageCircle, X, AlertCircle, RefreshCw, Bot, RotateCcw } from 'lucide-react'
import { useChatbotStore } from '@/application/store/chatbotStore'
import { useGroq } from '@/presentation/hooks/useGroq'
import { ChatMensaje } from './ChatMensaje'
import { ChatInput } from './ChatInput'

const MENSAJE_BIENVENIDA =
  '¡Hola! Soy tu asistente de Alpha Inmobiliaria en Guayaquil. ' +
  'Cuéntame qué propiedad buscas y te ayudaré a encontrarla. ' +
  'Puedes decirme, por ejemplo: "casa en venta en Urdesa, máximo 250k".'

export const ChatBot = () => {
  const { estaAbierto, toggleChat, estado, mensajeError, mensajes, limpiarError, agregarMensaje, reiniciarChat } = useChatbotStore()
  const { enviarMensaje } = useGroq()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bienvenidaRef = useRef(false)

  useEffect(() => {
    if (estaAbierto && !bienvenidaRef.current && mensajes.length === 0) {
      bienvenidaRef.current = true
      agregarMensaje('asistente', MENSAJE_BIENVENIDA)
    }
  }, [estaAbierto, mensajes.length, agregarMensaje])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes, estado])

  const handleReiniciar = () => {
    bienvenidaRef.current = true
    reiniciarChat()
    agregarMensaje('asistente', MENSAJE_BIENVENIDA)
  }

  return (
    <>
      {estaAbierto && (
        <div
          className="fixed bottom-20 right-4 z-50 w-[350px] sm:w-[380px] flex flex-col
                     bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ maxHeight: 'min(580px, calc(100vh - 100px))' }}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-[#2C3E50] text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <div>
                <p className="text-sm font-semibold">Asistente Inmobiliario</p>
                <p className="text-[10px] text-white/70">
                  {estado === 'procesando' ? 'Escribiendo...' : 'En línea'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReiniciar}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                title="Reiniciar conversación"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={toggleChat}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {(estado === 'error' || estado === 'rateLimit') && mensajeError && (
            <div className="mx-3 mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-red-700">{mensajeError}</p>
                <button
                  onClick={limpiarError}
                  className="flex items-center gap-1 text-xs text-red-600 hover:underline mt-1"
                >
                  <RefreshCw size={12} /> Reintentar
                </button>
              </div>
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: '180px' }}>
            {mensajes.map((msg) => (
              <ChatMensaje key={msg.id} mensaje={msg} />
            ))}
          </div>

          <ChatInput onEnviar={enviarMensaje} />
        </div>
      )}

      <button
        onClick={toggleChat}
        aria-label={estaAbierto ? 'Cerrar asistente' : 'Abrir asistente'}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full bg-[#2C3E50] text-white shadow-lg
                   flex items-center justify-center hover:bg-[#1a2a3a] hover:scale-105 active:scale-95
                   transition-all duration-200"
      >
        {estaAbierto ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}