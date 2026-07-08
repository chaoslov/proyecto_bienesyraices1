import { useEffect, useState } from 'react'
import { useAsesorStore } from '@/application/store/asesorStore'
import { AsesorCard } from '@/presentation/components/shared/AsesorCard'

export const AsesoresPage = () => {
  const { asesores, fetchAsesores, loading, error } = useAsesorStore()
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    if (asesores.length === 0) {
      fetchAsesores()
    }
  }, [asesores.length, fetchAsesores])

  const filtrados = asesores.filter((a) => {
    if (!busqueda) return true
    const q = busqueda.toLowerCase()
    return a.nombre.toLowerCase().includes(q) || a.apellido.toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#2C3E50] border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">Nuestros Asesores</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Buscar asesor por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {filtrados.map((asesor) => (
          <AsesorCard key={asesor.id} asesor={asesor} />
        ))}
      </div>

      {filtrados.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No se encontraron asesores con ese nombre.</p>
      )}
    </div>
  )
}
