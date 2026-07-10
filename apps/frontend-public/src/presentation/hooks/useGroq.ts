import { useCallback, useRef } from 'react'
import Groq from 'groq-sdk'
import { useChatbotStore } from '@/application/store/chatbotStore'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { propiedadesMock } from '@/infrastructure/mocks/propiedadesMock'
import {
  groqClient, GROQ_MODEL, GROQ_PARAMS, SYSTEM_PROMPT
} from '@/services/groqConfig'

const TIMEOUT_MS = 20_000

export function useGroq() {
  const abortRef = useRef<AbortController | null>(null)
  const procesandoRef = useRef<boolean>(false)
  const filtrosAcumuladosRef = useRef<any>({})

  const enviarMensaje = useCallback(async (textoUsuario: string) => {
    const store = useChatbotStore.getState()
    
    if (store.estado === 'cargando' || procesandoRef.current) return

    procesandoRef.current = true
    store.setEstado('cargando')
    
    store.agregarMensaje('usuario', textoUsuario)

    const historial = useChatbotStore.getState().mensajes
    const mensajesParaGroq = historial.map((m) => ({
      role: (m.rol === 'asistente' ? 'assistant' : 'user') as 'assistant' | 'user',
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
      const dataSparsed = JSON.parse(contenidoCrudo)
      console.log('=== GROQ RESPONSE ===', dataSparsed)

      const respuestaTexto = dataSparsed.respuestaAmigable || 'No logré procesar tu solicitud. ¿Podrías repetirla?'
      store.agregarMensaje('asistente', respuestaTexto)

      if (dataSparsed.reiniciar === true) {
        filtrosAcumuladosRef.current = {}
      }

      if (dataSparsed.filtros) {
        const nuevosFiltrosRaw = dataSparsed.filtros

        if (nuevosFiltrosRaw.ciudad != null) {
          delete filtrosAcumuladosRef.current.ciudad
          delete filtrosAcumuladosRef.current.sector
        }
        if (nuevosFiltrosRaw.sector != null && nuevosFiltrosRaw.ciudad == null) {
          delete filtrosAcumuladosRef.current.sector
        }

        const filtrosMapeados: any = {}
        if (nuevosFiltrosRaw.precio_maximo != null) filtrosMapeados.precioMax = nuevosFiltrosRaw.precio_maximo
        if (nuevosFiltrosRaw.precio_minimo != null) filtrosMapeados.precioMin = nuevosFiltrosRaw.precio_minimo
        if (nuevosFiltrosRaw.tipo_propiedad != null) filtrosMapeados.tipoPropiedad = nuevosFiltrosRaw.tipo_propiedad
        if (nuevosFiltrosRaw.tipo_transaccion != null) filtrosMapeados.tipoTransaccion = nuevosFiltrosRaw.tipo_transaccion
        if (nuevosFiltrosRaw.habitaciones != null) filtrosMapeados.habitaciones = nuevosFiltrosRaw.habitaciones
        if (nuevosFiltrosRaw.banos != null) filtrosMapeados.banios = nuevosFiltrosRaw.banos
        if (nuevosFiltrosRaw.area_minima != null) filtrosMapeados.areaMin = nuevosFiltrosRaw.area_minima
        if (nuevosFiltrosRaw.area_maxima != null) filtrosMapeados.areaMax = nuevosFiltrosRaw.area_maxima
        if (nuevosFiltrosRaw.ciudad != null) filtrosMapeados.ciudad = nuevosFiltrosRaw.ciudad
        if (nuevosFiltrosRaw.sector != null) filtrosMapeados.sector = nuevosFiltrosRaw.sector

        filtrosAcumuladosRef.current = {
          ...filtrosAcumuladosRef.current,
          ...filtrosMapeados
        }

        const f = filtrosAcumuladosRef.current

        let todasLasPropiedades: any[] = []
        try {
          const result = await PropiedadApi.listar({}, 1, 100)
          todasLasPropiedades = result.data
        } catch (err) {
          console.error('Chatbot: API fetch failed, usando mocks:', err)
          todasLasPropiedades = propiedadesMock.filter((p) => p.publicada)
        }
        
        const filtradas = todasLasPropiedades.filter((prop: any) => {
          if (f.tipoTransaccion && prop.tipoTransaccion?.toLowerCase() !== f.tipoTransaccion.toLowerCase()) return false
          if (f.tipoPropiedad && prop.tipoInmueble?.toLowerCase() !== f.tipoPropiedad.toLowerCase()) return false
          if (f.precioMax && prop.precio > f.precioMax) return false
          if (f.precioMin && prop.precio < f.precioMin) return false
          if (f.habitaciones && prop.habitaciones < f.habitaciones) return false
          if (f.banios && prop.banos < f.banios) return false
          if (f.areaMin && prop.areaTotal < f.areaMin) return false
          if (f.areaMax && prop.areaTotal > f.areaMax) return false
          
          const terminosBusqueda: string[] = []
          if (f.ciudad) terminosBusqueda.push(f.ciudad.toLowerCase())
          if (f.sector) terminosBusqueda.push(f.sector.toLowerCase())

          if (terminosBusqueda.length > 0) {
            const cumpleUbicacion = terminosBusqueda.every(termino => {
              return (
                prop.ubicacion?.ciudad?.toLowerCase().includes(termino) ||
                prop.ubicacion?.sector?.toLowerCase().includes(termino) ||
                prop.ubicacion?.direccion?.toLowerCase().includes(termino)
              )
            })
            
            if (!cumpleUbicacion) return false
          }
          
          return true
        })

        store.setPropiedadesFiltradas(filtradas)
        store.setFiltrosActivos({...filtrosAcumuladosRef.current})
        const postFilter = useChatbotStore.getState()
        console.log('=== POST FILTER ===', { count: postFilter.propiedadesFiltradas.length })
      }

      store.setEstado('idle')
      const postIdle = useChatbotStore.getState()
      console.log('=== POST IDLE ===', { count: postIdle.propiedadesFiltradas.length })

    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof DOMException && error.name === 'AbortError') {
        store.setError('La consulta tardó demasiado. Verifica tu conexión e intenta de nuevo.')
        return
      }
      if (error instanceof Groq.RateLimitError) {
        store.setEstado('rateLimit')
        store.agregarMensaje('asistente', 'Alcanzamos el límite del plan gratuito temporalmente. Intenta en un momento.')
        setTimeout(() => store.setEstado('idle'), 10000)
        return
      }
      
      const msg = error instanceof Error ? error.message : 'Error desconocido.'
      store.setError(`No se pudo procesar la respuesta: ${msg}`)
      store.setEstado('idle')
    } finally {
      abortRef.current = null
      procesandoRef.current = false
    }
  }, [])

  const limpiarFiltrosYContexto = useCallback(() => {
    filtrosAcumuladosRef.current = {}
    useChatbotStore.getState().setPropiedadesFiltradas([])
  }, [])

  const cancelarPeticion = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { enviarMensaje, cancelarPeticion, limpiarFiltrosYContexto }
}