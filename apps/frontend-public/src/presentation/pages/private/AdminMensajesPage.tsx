import { useEffect, useState } from 'react'
import { useAuthStore } from '@/application/store/authStore'
import { MensajeApi, MensajeFromAPI } from '@/infrastructure/api/repositories/MensajeApiRepository'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'
import { Asesor } from '@/domain/entities/Asesor'
import { Mail, Check, Trash2, UserPlus, X } from 'lucide-react'

type Filtro = 'todos' | 'no_leidos' | 'leidos'

export const AdminMensajesPage = () => {
  const { user } = useAuthStore()
  const [mensajes, setMensajes] = useState<MensajeFromAPI[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [asignandoId, setAsignandoId] = useState<string | null>(null)
  const [asesores, setAsesores] = useState<Asesor[]>([])
  const [selectedAsesorId, setSelectedAsesorId] = useState('')

  const cargar = () => {
    setLoading(true)
    Promise.all([
      MensajeApi.listarAdmin({ tipo: 'venta', archivado: false }),
      AsesorApi.listarAdmin(),
    ])
      .then(([msgs, ases]) => {
        setMensajes(msgs)
        setAsesores(ases.filter((a) => a.id !== user?.asesorId))
      })
      .catch(() => setMensajes([]))
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

  const eliminarMensaje = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return
    try {
      await MensajeApi.eliminar(id)
      cargar()
    } catch { alert('Error al eliminar') }
  }

  const confirmarAsignacion = async () => {
    if (!asignandoId || !selectedAsesorId) return
    try {
      await MensajeApi.asignar(asignandoId, selectedAsesorId)
      setAsignandoId(null)
      setSelectedAsesorId('')
      cargar()
    } catch { alert('Error al asignar mensaje') }
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
          <h1 className="text-2xl font-bold text-gray-800">Mensajes de Venta</h1>
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
          <p className="text-gray-500">No hay mensajes de venta</p>
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
                    {msg.estadoAsignacion === 'rechazado' && (
                      <span className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full flex-shrink-0">
                        Rechazado
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
                    onClick={() => { setAsignandoId(msg.id); setSelectedAsesorId('') }}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Asignar a asesor"
                  >
                    <UserPlus className="w-4 h-4" />
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

              {asignandoId === msg.id && (
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 flex-wrap">
                    <label className="text-sm font-medium text-gray-700">Asignar a:</label>
                    <select
                      value={selectedAsesorId}
                      onChange={(e) => setSelectedAsesorId(e.target.value)}
                      className="flex-1 min-w-[200px] px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C3E50] focus:border-transparent"
                    >
                      <option value="">Seleccionar asesor...</option>
                      {asesores.map((a) => (
                        <option key={a.id} value={a.id}>{a.nombre}</option>
                      ))}
                    </select>
                    <button
                      onClick={confirmarAsignacion}
                      disabled={!selectedAsesorId}
                      className="px-4 py-1.5 text-sm font-medium bg-[#2C3E50] text-white rounded-lg hover:bg-[#1a252f] disabled:opacity-50 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setAsignandoId(null)}
                      className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
