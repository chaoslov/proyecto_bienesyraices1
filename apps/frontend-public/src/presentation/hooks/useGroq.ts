import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Groq from 'groq-sdk'
import { useChatbotStore } from '@/application/store/chatbotStore'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import {
  groqClient, GROQ_MODEL, GROQ_PARAMS, SYSTEM_PROMPT, sanitizarRespuestaGroq,
} from '@/services/groqConfig'

const TIMEOUT_MS = 20_000

const MENSAJE_BIENVENIDA =
  '¡Hola! Soy tu asistente de Alpha Inmobiliaria en Guayaquil. ' +
  'Cuéntame qué propiedad buscas y te ayudaré a encontrarla. ' +
  'Puedes decirme, por ejemplo: "casa en venta en Urdesa, máximo 250k".'

export function useGroq() {
  const navigate = useNavigate()
  const abortRef = useRef<AbortController | null>(null)

  const enviarMensaje = useCallback(async (textoUsuario: string) => {
    const store = useChatbotStore.getState()
    if (store.estado === 'procesando') return

    store.setEstado('procesando')
    store.setEstaEscribiendo(true)
    store.agregarMensaje('usuario', textoUsuario)
    const idBurbuja = store.agregarMensaje('asistente', '', { esCargando: true })

    const historial = useChatbotStore.getState().mensajes
    const mensajesParaGroq = historial
      .filter((m) => !m.esCargando)
      .map((m) => ({
        role: (m.rol === 'asistente' ? 'assistant' : 'user') as const,
        content: m.contenido,
      }))

    abortRef.current = new AbortController()
    const timeoutId = setTimeout(() => abortRef.current?.abort(), TIMEOUT_MS)

    try {
      const completion = await groqClient.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...mensajesParaGroq,
        ],
        response_format: { type: 'json_object' },
        ...GROQ_PARAMS,
      }, { signal: abortRef.current.signal })

      clearTimeout(timeoutId)
      const contenidoCrudo = completion.choices[0]?.message?.content ?? '{}'
      const respuesta = sanitizarRespuestaGroq(JSON.parse(contenidoCrudo))

      if (respuesta.reiniciar) {
        store.reiniciarChat()
        store.agregarMensaje('asistente', respuesta.respuestaAmigable || MENSAJE_BIENVENIDA)
        store.setEstado('listo')
        return
      }

      store.actualizarMensaje(idBurbuja, { contenido: respuesta.respuestaAmigable, esCargando: false })

      if (respuesta.hayFiltros) {
        const filtros: Record<string, any> = {}
        if (respuesta.tipoInmueble) filtros.tipoInmueble = respuesta.tipoInmueble
        if (respuesta.tipoTransaccion) filtros.tipoTransaccion = respuesta.tipoTransaccion
        if (respuesta.precioMin) filtros.precioMin = respuesta.precioMin
        if (respuesta.precioMax) filtros.precioMax = respuesta.precioMax
        if (respuesta.habitaciones) filtros.habitaciones = respuesta.habitaciones
        if (respuesta.ubicacion) filtros.ciudad = respuesta.ubicacion
        usePropiedadStore.getState().setFiltros(filtros)
        useChatbotStore.getState().setChatAbierto(false)
        setTimeout(() => navigate('/propiedades'), 500)
      }

      store.setEstado('listo')
    } catch (error) {
      clearTimeout(timeoutId)
      store.eliminarMensaje(idBurbuja)

      if (error instanceof DOMException && error.name === 'AbortError') {
        store.setError('La consulta tardó demasiado. Verifica tu conexión e intenta de nuevo.')
        return
      }
      if (error instanceof Groq.RateLimitError) {
        store.setEstado('rateLimit')
        const retryAfter = (error as any).headers?.['retry-after']
        const segundos = retryAfter ? parseInt(retryAfter, 10) : 60
        store.agregarMensaje('asistente',
          `Alcanzamos el límite de consultas del plan gratuito. Intenta de nuevo en ${segundos} segundos.`)
        setTimeout(() => store.setEstado('listo'), segundos * 1000)
        return
      }
      if (error instanceof Groq.AuthenticationError) {
        store.setError('API Key de Groq inválida. Revisa el archivo .env del proyecto.')
        return
      }
      if (error instanceof Groq.APIError) {
        store.setError(`Error del servidor de Groq (${error.status}). Intenta en unos segundos.`)
        return
      }
      const msg = error instanceof Error ? error.message : 'Error desconocido.'
      store.setError(`No se pudo procesar la respuesta: ${msg}`)
    } finally {
      store.setEstaEscribiendo(false)
      abortRef.current = null
    }
  }, [navigate])

  const cancelarPeticion = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { enviarMensaje, cancelarPeticion }
}
