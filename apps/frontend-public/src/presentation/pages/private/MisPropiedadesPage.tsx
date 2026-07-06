import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'

export const MisPropiedadesPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)

  const cargar = () => {
    const asesorId = user?.asesor?.id
    if (!asesorId) return
    setLoading(true)
    PropiedadApi.listar({ asesorId }, 1, 100)
      .then((r) => setPropiedades(r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [user])

  const alternarPublicado = async (id: string, actual: boolean) => {
    try {
      await PropiedadApi.cambiarEstado(id, actual ? 'pausada' : 'activa')
      cargar()
    } catch { alert('Error al cambiar el estado') }
  }

  const eliminarPropiedad = async (id: string) => {
    if (!confirm('¿Eliminar esta propiedad?')) return
    try {
      await PropiedadApi.eliminar(id)
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
          <h1 className="text-2xl font-bold text-gray-800">Mis Propiedades</h1>
          <p className="text-sm text-gray-500 mt-1">{propiedades.length} propiedades registradas</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
          title="Deshabilitado temporalmente"
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
            disabled
            className="mt-4 bg-gray-300 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-sm"
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
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    {prop.publicada ? (
                      <><Eye className="w-4 h-4" /> Publicado</>
                    ) : (
                      <><EyeOff className="w-4 h-4" /> No publicado</>
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
                      onClick={() => eliminarPropiedad(prop.id)}
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
    </div>
  )
}

function Building2(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>}
