import { Bot, User } from 'lucide-react'
import type { ChatMensaje as TChatMensaje } from '@/application/store/chatbotStore'

interface Props { mensaje: TChatMensaje }

export const ChatMensaje = ({ mensaje }: Props) => {
  const esUsuario = mensaje.rol === 'usuario'

  return (
    <div className={`flex gap-2 ${esUsuario ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
        esUsuario ? 'bg-[#2C3E50]' : 'bg-gray-200'
      }`}>
        {esUsuario
          ? <User size={14} className="text-white" />
          : <Bot size={14} className="text-gray-600" />
        }
      </div>
      <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
        esUsuario
          ? 'bg-[#2C3E50] text-white rounded-tr-sm'
          : 'bg-gray-100 text-gray-800 rounded-tl-sm'
      }`}>
        {mensaje.esCargando ? (
          <span className="flex gap-1 items-center h-4">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </span>
        ) : mensaje.contenido}
      </div>
    </div>
  )
}
