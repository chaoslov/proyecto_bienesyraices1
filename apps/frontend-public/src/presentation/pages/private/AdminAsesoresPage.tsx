import { useEffect, useState } from 'react'
import { Asesor } from '@/domain/entities/Asesor'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'
import { AsesorFormModal } from '@/presentation/components/asesores/AsesorFormModal'
import { useAuthStore } from '@/application/store/authStore'
import { Users, Plus, Pencil, Trash2 } from 'lucide-react'

export const AdminAsesoresPage = () => {
  const { user } = useAuthStore()
  const [asesores, setAsesores] = useState<Asesor[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<Asesor | null>(null)

  const cargar = () => {
    setLoading(true)
    AsesorApi.listarAdmin()
      .then((lista) => setAsesores(lista.filter((a) => a.id !== user?.asesorId)))
      .catch(() => setAsesores([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    cargar()

    const refrescar = () => cargar()

    window.addEventListener('popstate', refrescar)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refrescar()
    })

    return () => {
      window.removeEventListener('popstate', refrescar)
      document.removeEventListener('visibilitychange', refrescar)
    }
  }, [])

  const abrirCrear = () => {
    setEditando(null)
    setModalAbierto(true)
  }

  const abrirEditar = (asesor: Asesor) => {
    setEditando(asesor)
    setModalAbierto(true)
  }

  const guardar = async (data: any) => {
    if (editando) {
      await AsesorApi.actualizar(editando.id, data)
    } else {
      await AsesorApi.crear(data)
    }
    setModalAbierto(false)
    setEditando(null)
    cargar()
  }

  const eliminar = async (asesor: Asesor) => {
    if (!confirm(`¿Eliminar a ${asesor.nombre}?`)) return
    try {
      await AsesorApi.eliminar(asesor.id)
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
          <h1 className="text-2xl font-bold text-gray-800">Admin Asesores</h1>
          <p className="text-sm text-gray-500 mt-1">{asesores.length} asesores</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#C47B4A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b06a3d] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Asesor
        </button>
      </div>

      {asesores.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay asesores registrados</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Teléfono</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Rol</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Propiedades</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {asesores.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.nombre}</td>
                    <td className="px-4 py-3 text-gray-600">{a.email}</td>
                    <td className="px-4 py-3 text-gray-600">{a.telefono}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.rol === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {a.rol || 'asesor'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{a.propiedadesCount ?? 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => abrirEditar(a)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminar(a)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalAbierto && (
        <AsesorFormModal
          asesor={editando}
          onClose={() => { setModalAbierto(false); setEditando(null) }}
          onSave={guardar}
        />
      )}
    </div>
  )
}
