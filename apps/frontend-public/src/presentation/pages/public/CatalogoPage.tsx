import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { PropiedadCard } from '@/presentation/components/shared/PropiedadCard'
import { Filtros } from '@/presentation/components/shared/Filtros'
import { Paginacion } from '@/presentation/components/shared/Paginacion'

export const CatalogoPage = () => {
  const { propiedades, total, page, fetchPropiedades, loading, error, filtros, setFiltros } = usePropiedadStore()
  const [searchParams] = useSearchParams()
  const LIMIT = 12
  const totalPages = Math.ceil(total / LIMIT)

  const handlePageChange = (nuevaPagina: number) => {
    fetchPropiedades(nuevaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    usePropiedadStore.getState().limpiarFiltros()
  }, [])

  useEffect(() => {
    const tipo = searchParams.get('tipo')
    if (tipo) {
      setFiltros({ tipoTransaccion: tipo })
    }
  }, [searchParams, setFiltros])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchPropiedades()
    }, 300)
    return () => clearTimeout(debounce)
  }, [filtros, fetchPropiedades])

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6 text-[#2C3E50]">Catálogo de Propiedades</h1>
      <p className="text-gray-600 mb-6">
        {total} propiedades encontradas
      </p>

      <Filtros />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-[#2C3E50] border-t-transparent rounded-full" />
        </div>
      ) : propiedades.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron propiedades con los filtros seleccionados.</p>
          <p className="text-sm text-gray-400">Prueba ajustando los filtros de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((prop) => (
            <PropiedadCard key={prop.id} propiedad={prop} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <Paginacion
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
