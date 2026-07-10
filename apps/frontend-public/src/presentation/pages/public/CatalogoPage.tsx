import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { PropiedadCard } from '@/presentation/components/shared/PropiedadCard'
import { Filtros } from '@/presentation/components/shared/Filtros'
import { Paginacion } from '@/presentation/components/shared/Paginacion'
import { MapaPropiedades } from '@/presentation/components/map/MapaPropiedades'

export const CatalogoPage = () => {
  const { propiedades, total, page, fetchPropiedades, loading, error, filtros, setFiltros } = usePropiedadStore()
  const [searchParams] = useSearchParams()
  const LIMIT = 12
  const totalPages = Math.ceil(total / LIMIT)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handlePageChange = (nuevaPagina: number) => {
    fetchPropiedades(nuevaPagina)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    usePropiedadStore.getState().limpiarFiltros()
  }, [])

  useEffect(() => {
    const tipo = searchParams.get('tipo')
    const tipoInmueble = searchParams.get('tipoInmueble')
    const precioMin = searchParams.get('precioMin')
    const precioMax = searchParams.get('precioMax')
    const habitaciones = searchParams.get('habitaciones')
    const ciudad = searchParams.get('ciudad')
    const busqueda = searchParams.get('busqueda')
    const sector = searchParams.get('sector')
    const banos = searchParams.get('banos')
    const areaMin = searchParams.get('areaMin')
    const areaMax = searchParams.get('areaMax')

    const filtrosDesdeURL: Record<string, string | number> = {}
    if (tipo) filtrosDesdeURL.tipoTransaccion = tipo
    if (tipoInmueble) filtrosDesdeURL.tipoInmueble = tipoInmueble
    if (precioMin) filtrosDesdeURL.precioMin = Number(precioMin)
    if (precioMax) filtrosDesdeURL.precioMax = Number(precioMax)
    if (habitaciones) filtrosDesdeURL.habitaciones = Number(habitaciones)
    if (ciudad) filtrosDesdeURL.ciudad = ciudad
    if (sector) filtrosDesdeURL.sector = sector
    if (banos) filtrosDesdeURL.banos = Number(banos)
    if (areaMin) filtrosDesdeURL.areaMin = Number(areaMin)
    if (areaMax) filtrosDesdeURL.areaMax = Number(areaMax)
    if (busqueda) filtrosDesdeURL.busqueda = busqueda

    if (Object.keys(filtrosDesdeURL).length > 0) {
      setFiltros(filtrosDesdeURL)
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
      <p className="text-gray-600 mb-6">{total} propiedades encontradas</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
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
                <PropiedadCard key={prop.id} propiedad={prop} onSelect={(id) => setSelectedId(id)} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Paginacion currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="hidden lg:block sticky top-20 h-[80vh] rounded-lg overflow-hidden border border-gray-100">
            <MapaPropiedades altura="100%" selectedId={selectedId} />
          </div>
          <div className="block lg:hidden mt-6 h-64 rounded-lg overflow-hidden border border-gray-100">
            <MapaPropiedades altura="100%" selectedId={selectedId} />
          </div>
        </div>
      </div>
    </div>
  )
}