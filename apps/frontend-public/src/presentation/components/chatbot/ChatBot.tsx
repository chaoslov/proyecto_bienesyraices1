import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle, X, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react'
import { useChatbotStore } from '@/application/store/chatbotStore'
import { useGroq } from '@/presentation/hooks/useGroq'
import { ChatMensaje } from './ChatMensaje'
import { ChatInput } from './ChatInput'
import { ChatTarjetaPropiedad } from './ChatTarjetaPropiedad'
import alphaBotAvatar from './resources/alphabot-avatar.jpg'

const MENSAJE_BIENVENIDA =
  '👋 ¡Hola! Soy AlphaBot, tu asistente inmobiliario. ' +
  'Puedo ayudarte a encontrar casas, departamentos, terrenos o locales que estén disponibles dentro de nuestro catálogo. ' +
  'Cuéntame qué estás buscando.'

export const ChatBot = () => {
  const navigate = useNavigate()
  const { 
    estaAbierto, 
    toggleChat, 
    estado, 
    mensajeError, 
    mensajes, 
    propiedadesFiltradas, 
    limpiarError, 
    agregarMensaje, 
    reiniciarChat 
  } = useChatbotStore()
  
  const { enviarMensaje, limpiarFiltrosYContexto } = useGroq()
  const scrollRef = useRef<HTMLDivElement>(null)
  const bienvenidaRef = useRef(false)

  // Línea de control de datos para verificar en la consola (F12)
  console.log("=== CONTROL CHATBOT ===", { 
    estadoActual: estado, 
    cantidadPropiedades: propiedadesFiltradas ? propiedadesFiltradas.length : 0, 
    propiedadesFiltradas 
  });

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
  }, [mensajes, estado, propiedadesFiltradas])

  const handleReiniciar = () => {
    limpiarFiltrosYContexto()
    bienvenidaRef.current = true
    reiniciarChat()
    agregarMensaje('asistente', MENSAJE_BIENVENIDA)
  }

  return (
    <>
      {estaAbierto && (
        <div
          className="fixed bottom-20 right-4 z-50 w-[360px] sm:w-[440px] flex flex-col
                     bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{ height: 'min(640px, calc(100vh - 100px))' }}
        >
          {/* ENCABEZADO */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#2C3E50] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-white/20 overflow-hidden flex-shrink-0">
                <img src={alphaBotAvatar} alt="AlphaBot Logo" className="w-full h-full object-cover scale-[1.28]" />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm font-bold tracking-wide leading-tight">AlphaBot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[11px] text-white/80">Asistente inmobiliario</p>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                  <p className="text-[11px] text-white/80">En línea</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={handleReiniciar} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Reiniciar conversación">
                <RotateCcw size={15} />
              </button>
              <button onClick={toggleChat} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* MENSAJES DE ERROR */}
          {(estado === 'error' || estado === 'rateLimit') && mensajeError && (
            <div className="mx-3 mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
              <AlertCircle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-red-700">{mensajeError}</p>
                <button onClick={limpiarError} className="flex items-center gap-1 text-xs text-red-600 hover:underline mt-1">
                  <RefreshCw size={12} /> Reintentar
                </button>
              </div>
            </div>
          )}

          {/* ÁREA DE CONVERSACIÓN */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
            {mensajes.map((msg) => (
              <ChatMensaje key={msg.id} mensaje={msg} onEnviarSugerencia={enviarMensaje} />
            ))}

            {/* BURBUJA DE CARGA (PROCESANDO) */}
            {estado === 'cargando' && (
              <div className="flex justify-start items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
                  <img src={alphaBotAvatar} alt="AlphaBot" className="w-full h-full object-cover scale-[1.28]" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center justify-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            {estado === 'idle' && propiedadesFiltradas && propiedadesFiltradas.length > 0 && (
              <div className="space-y-3 pt-2 pl-10 animate-fade-in">
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin snap-x scroll-smooth">
                  {propiedadesFiltradas.slice(0, 4).map((propiedad) => (
                    <ChatTarjetaPropiedad key={propiedad.id} propiedad={propiedad} />
                  ))}
                </div>

                {propiedadesFiltradas.length > 4 && (
                  <button
                    onClick={() => {
                      const { filtrosActivos } = useChatbotStore.getState()
                      const params = new URLSearchParams()
                      if (filtrosActivos.ciudad) params.set('ciudad', filtrosActivos.ciudad)
                      if (filtrosActivos.sector) params.set('sector', filtrosActivos.sector)
                      if (filtrosActivos.tipoPropiedad) params.set('tipoInmueble', filtrosActivos.tipoPropiedad)
                      if (filtrosActivos.tipoTransaccion) params.set('tipo', filtrosActivos.tipoTransaccion)
                      if (filtrosActivos.precioMax) params.set('precioMax', String(filtrosActivos.precioMax))
                      if (filtrosActivos.precioMin) params.set('precioMin', String(filtrosActivos.precioMin))
                      if (filtrosActivos.habitaciones) params.set('habitaciones', String(filtrosActivos.habitaciones))
                      if (filtrosActivos.banios) params.set('banos', String(filtrosActivos.banios))
                      if (filtrosActivos.areaMin) params.set('areaMin', String(filtrosActivos.areaMin))
                      if (filtrosActivos.areaMax) params.set('areaMax', String(filtrosActivos.areaMax))
                      const qs = params.toString()
                      navigate(`/propiedades${qs ? `?${qs}` : ''}`)
                    }}
                    className="w-full py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl
                               text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 
                               transition-colors shadow-sm"
                  >
                    🏢 Ver las {propiedadesFiltradas.length} propiedades encontradas →
                  </button>
                )}
                
                <p className="text-[11px] text-gray-400 italic text-center">
                  ¿No encontraste lo que buscas? Ajustemos tu búsqueda.
                </p>
              </div>
            )}
          </div>

          {/* CONTENEDOR INFERIOR INPUT */}
          <div className="bg-white p-3 border-t border-slate-100">
            <ChatInput onEnviar={enviarMensaje} placeholder="Escribe tu búsqueda..." />
          </div>
        </div>
      )}

      {/* BOTÓN FLOTANTE */}
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