import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Plus, Edit, Trash2, Eye, EyeOff, Building2 } from 'lucide-react'
import { ModalConfirmacion } from '@/presentation/components/shared/ModalConfirmacion'

export const MisPropiedadesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [eliminando, setEliminando] = useState(false)
  const [eliminarId, setEliminarId] = useState<string | null>(null)

  const cargar = () => {
    setLoading(true)
    PropiedadApi.listarMias(1, 100)
      .then((r) => setPropiedades(r.data))
      .catch(() => setPropiedades([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [user])

  const alternarPublicado = async (id: string, actual: boolean) => {
    try {
      await PropiedadApi.cambiarEstado(id, actual ? 'pausada' : 'activa')
      cargar()
    } catch { alert('Error al cambiar el estado') }
  }

  const confirmarEliminar = async () => {
    if (!eliminarId) return
    setEliminando(true)
    try {
      await PropiedadApi.eliminar(eliminarId)
      setEliminarId(null)
      cargar()
    } catch (err: any) {
      alert(err?.message || 'Error al eliminar la propiedad. Verifica que el servidor esté funcionando.')
    } finally {
      setEliminando(false)
    }
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
          <h1 className="text-2xl font-bold text-gray-800">Mis Propiedades</h1>
          <p className="text-sm text-gray-500 mt-1">{propiedades.length} propiedades registradas</p>
        </div>
        <button
          onClick={() => navigate('/panel/propiedades/nueva')}
          className="flex items-center gap-2 bg-[#2C3E50] text-white px-4 py-2 rounded-lg hover:bg-[#1a2a3a] transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Agregar Propiedad
        </button>
      </div>

      {propiedades.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No tienes propiedades registradas</p>
          <button
            onClick={() => navigate('/panel/propiedades/nueva')}
            className="mt-4 bg-[#2C3E50] text-white px-4 py-2 rounded-lg hover:bg-[#1a2a3a] transition text-sm"
          >
            Crear tu primera propiedad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((prop) => (
            <div key={prop.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={prop.imagenes?.[0] || 'https://picsum.photos/seed/default/400/300'}
                  alt={prop.titulo}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  prop.tipoTransaccion === 'venta'
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}>
                  {prop.tipoTransaccion.toUpperCase()}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{prop.titulo}</h3>
                <p className="text-xl font-bold text-[#C47B4A] mt-1">
                  ${prop.precio.toLocaleString()}
                </p>

                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>{prop.habitaciones} hab.</span>
                  <span>{prop.banos} baños</span>
                  <span>{prop.areaTotal} m²</span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => alternarPublicado(prop.id, prop.publicada)}
                    className={`flex items-center gap-1 text-sm font-medium ${
                      prop.publicada
                        ? 'text-green-600 hover:text-green-700'
                        : 'text-red-600 hover:text-red-700'
                    }`}
                  >
                    {prop.publicada ? (
                      <><Eye className="w-4 h-4" /> Disponible</>
                    ) : (
                      <><EyeOff className="w-4 h-4" /> No disponible</>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/panel/propiedades/editar/${prop.id}`)}
                      className="p-1.5 text-[#2C3E50] hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEliminarId(prop.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalConfirmacion
        abierto={!!eliminarId}
        titulo="Eliminar propiedad"
        mensaje="¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer."
        onConfirmar={confirmarEliminar}
        onCancelar={() => setEliminarId(null)}
        confirmando={eliminando}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
      />
    </div>
  )
}
