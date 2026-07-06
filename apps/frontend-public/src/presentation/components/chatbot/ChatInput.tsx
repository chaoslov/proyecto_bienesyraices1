import { useRef, type KeyboardEvent, type ChangeEvent } from 'react'
import { Send } from 'lucide-react'
import { selectPuedeEscribir, useChatbotStore } from '@/application/store/chatbotStore'

interface Props { onEnviar: (texto: string) => void }

export const ChatInput = ({ onEnviar }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const puedeEscribir = useChatbotStore(selectPuedeEscribir)

  const handleEnviar = () => {
    const texto = textareaRef.current?.value.trim() ?? ''
    if (!texto || !puedeEscribir) return
    onEnviar(texto)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleEnviar()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-200 bg-white">
      <textarea
        ref={textareaRef}
        rows={1}
        disabled={!puedeEscribir}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={puedeEscribir ? 'Ej: casas en venta en Urdesa...' : 'Procesando...'}
        className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2
                   text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                   focus:ring-[#C47B4A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{ minHeight: '38px' }}
      />
      <button
        onClick={handleEnviar}
        disabled={!puedeEscribir}
        aria-label="Enviar mensaje"
        className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#2C3E50] text-white flex items-center
                   justify-center hover:bg-[#1a2a3a] active:scale-95 disabled:opacity-40
                   disabled:cursor-not-allowed transition-all"
      >
        <Send size={16} />
      </button>
    </div>
  )
}
