import { ChatMensaje as TipoMensaje } from '@/application/store/chatbotStore'
import alphaBotAvatar from './resources/alphabot-avatar.jpg'

interface Props {
  mensaje: TipoMensaje
  onEnviarSugerencia: (texto: string) => void
}

export const ChatMensaje = ({ mensaje }: Props) => {
  const esAsistente = mensaje.rol === 'asistente'

  return (
    <div className={`flex ${esAsistente ? 'justify-start items-start gap-2.5' : 'justify-end'}`}>
      
      {/* Si es el bot, pintamos su foto de perfil a la izquierda */}
      {esAsistente && (
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-200 overflow-hidden flex-shrink-0">
          <img 
            src={alphaBotAvatar} 
            alt="Bot avatar" 
            className="w-full h-full object-cover scale-[1.28]" 
          />
        </div>
      )}

      {/* Cuerpo del mensaje limpio sin hora */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm relative
          ${esAsistente 
            ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' 
            : 'bg-[#2C3E50] text-white rounded-tr-none'
          }`}
      >
        <p className="whitespace-pre-line leading-relaxed">{mensaje.contenido}</p>
      </div>
    </div>
  )
}