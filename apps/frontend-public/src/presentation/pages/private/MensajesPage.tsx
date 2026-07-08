import { useEffect, useState } from 'react'
import { useAuthStore } from '@/application/store/authStore'
import { MensajeApi, MensajeFromAPI } from '@/infrastructure/api/repositories/MensajeApiRepository'
import { Mail, Check, Trash2, Archive } from 'lucide-react'

type Filtro = 'todos' | 'no_leidos' | 'leidos'

export const MensajesPage = () => {
  const { user } = useAuthStore()
  const [mensajes, setMensajes] = useState<MensajeFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('todos')

  const asesorId = user?.asesor?.id

  const cargar = () => {
    if (!asesorId) return
    setLoading(true)
    MensajeApi.listarPorAsesor(asesorId, { archivado: false })
      .then(setMensajes)
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [user])

  const filtrados = mensajes.filter((m) => {
    if (filtro === 'no_leidos') return !m.leido
    if (filtro === 'leidos') return m.leido
    return true
  })

  const noLeidos = mensajes.filter((m) => !m.leido).length

  const marcarComoLeido = async (id: string) => {
    try {
      await MensajeApi.marcarLeido(id)
      cargar()
    } catch { alert('Error al marcar como leído') }
  }

  const archivar = async (id: string) => {
    try {
      await MensajeApi.archivar(id)
      cargar()
    } catch { alert('Error al archivar') }
  }

  const eliminarMensaje = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    try {
      await MensajeApi.eliminar(id)
      cargar()
    } catch { alert('Error al eliminar') }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#2C3E50] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bandeja de Mensajes</h1>
          <p className="text-sm text-gray-500 mt-1">{mensajes.length} mensajes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['todos', 'no_leidos', 'leidos'] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filtro === f
                  ? 'bg-[#2C3E50] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'todos' && `Todos (${mensajes.length})`}
              {f === 'no_leidos' && `No leídos (${noLeidos})`}
              {f === 'leidos' && 'Leídos'}
            </button>
          ))}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay mensajes en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${
                !msg.leido ? 'border-l-4 border-[#C47B4A]' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base break-words">
                      {msg.nombre}
                    </h3>
                    {!msg.leido && (
                      <span className="bg-[#C47B4A]/10 text-[#C47B4A] text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 break-words">
                    {msg.email}
                    {msg.telefono ? ` • ${msg.telefono}` : ''}
                  </p>
                  {msg.propiedadTitulo && (
                    <p className="text-xs text-gray-400 mt-1 break-words">
                      Propiedad: {msg.propiedadTitulo}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2 break-words">{msg.mensaje}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleDateString('es-EC', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 self-end sm:self-start">
                  {!msg.leido && (
                    <button
                      onClick={() => marcarComoLeido(msg.id)}
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Marcar como leído"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => archivar(msg.id)}
                    className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Archivar"
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => eliminarMensaje(msg.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
