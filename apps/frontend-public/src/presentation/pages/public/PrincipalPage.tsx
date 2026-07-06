import { useNavigate } from 'react-router-dom'
import { MapaPropiedades } from '@/presentation/components/map/MapaPropiedades'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { Button } from '@/presentation/components/ui/Botones'
import { Input } from '@/presentation/components/ui/Entrada'
import { PropiedadCard } from '@/presentation/components/shared/PropiedadCard'
import { useEffect, useState } from 'react'

export const PrincipalPage = () => {
  const navigate = useNavigate()
  const { propiedades, setPropiedades, setFiltros, fetchDestacadas, loading } = usePropiedadStore()
  const [busqueda, setBusqueda] = useState('')
  const destacadas = propiedades.filter((p) => p.destacada)

  useEffect(() => {
    if (propiedades.length === 0) {
      fetchDestacadas().then((list) => {
        if (list.length > 0) setPropiedades(list)
      })
    }
  }, [propiedades.length, setPropiedades, fetchDestacadas])

  const handleBuscar = () => {
    if (busqueda.trim()) {
      setFiltros({ busqueda: busqueda.trim() })
      navigate('/propiedades')
    }
  }

  return (
    <div>
      <section className="relative h-[85vh] min-h-[550px] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <MapaPropiedades altura="100%" />
        </div>

        <div className="absolute inset-0 bg-[#2C3E50]/30 z-10 pointer-events-none" />

        <div className="absolute inset-0 z-20 flex items-start justify-center pt-20 md:pt-28 px-4 pointer-events-none">
          <div className="w-full max-w-2xl flex gap-2 pointer-events-auto">
            <Input
              placeholder="Busca por sector, ciudad o tipo de propiedad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              className="flex-1 text-base py-2 bg-white/90 backdrop-blur-sm border-white/50 focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent"
            />
            <Button onClick={handleBuscar} size="md" className="px-4">
              Buscar
            </Button>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-white/60 text-sm animate-bounce hidden md:block">
          ↓ Desplázate para ver más
        </div>
      </section>

      <section className="container-custom py-12">
        <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-8">
          Propiedades Destacadas
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-[#2C3E50] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destacadas.slice(0, 3).map((prop) => (
              <PropiedadCard key={prop.id} propiedad={prop} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate('/propiedades')}>
            Ver todas las propiedades →
          </Button>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center text-[#2C3E50] mb-12">
            Nuestros Servicios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#2C3E50]/10 rounded-full flex items-center justify-center text-[#2C3E50] group-hover:bg-[#2C3E50] group-hover:text-white transition-colors duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Compra</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Encuentra la casa o departamento perfecto para ti y tu familia.
              </p>
            </div>

            <div className="group bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#2C3E50]/10 rounded-full flex items-center justify-center text-[#2C3E50] group-hover:bg-[#2C3E50] group-hover:text-white transition-colors duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Venta</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Publica tu propiedad y conéctala con los compradores ideales.
              </p>
            </div>

            <div className="group bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-[#2C3E50]/10 rounded-full flex items-center justify-center text-[#2C3E50] group-hover:bg-[#2C3E50] group-hover:text-white transition-colors duration-300">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Alquiler</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Encuentra el lugar perfecto para alquilar sin complicaciones.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
