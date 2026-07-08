import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { Button } from '@/presentation/components/ui/Botones'
import { Asesor } from '@/domain/entities/Asesor'
import { Propiedad } from '@/domain/entities/Propiedad'

function formatearPrecio(precio: number) {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(precio)
}

interface PropiedadHorizontalProps {
  propiedad: Propiedad
}

const PropiedadHorizontalCard = ({ propiedad }: PropiedadHorizontalProps) => {
  return (
    <Link
      to={`/propiedad/${propiedad.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-44 sm:h-auto bg-gray-200 flex-shrink-0">
          <img
            src={propiedad.imagenes?.[0] || 'https://picsum.photos/seed/default/400/300'}
            alt={propiedad.titulo}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span
              className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                propiedad.tipoTransaccion === 'venta'
                  ? 'bg-[#C47B4A]/10 text-[#C47B4A]'
                  : 'bg-[#2C3E50]/10 text-[#2C3E50]'
              }`}
            >
              {propiedad.tipoTransaccion === 'venta' ? 'Venta' : 'Alquiler'}
            </span>
            <h3 className="text-lg font-bold text-[#2C3E50] mt-2">{propiedad.titulo}</h3>
            <p className="text-xl font-bold text-[#C47B4A] mt-1">
              {formatearPrecio(propiedad.precio)}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
              <span>{propiedad.habitaciones} dorm</span>
              <span>{propiedad.banos} {propiedad.banos === 1 ? 'baño' : 'baños'}</span>
              <span>{propiedad.areaTotal} m&sup2;</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {propiedad.ubicacion?.direccion}, {propiedad.ubicacion?.ciudad}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export const PerfilAsesorPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [asesor, setAsesor] = useState<Asesor | null>(null)
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      AsesorApi.obtenerPorId(id),
      PropiedadApi.listar({ asesorId: id }, 1, 50),
    ])
      .then(([asesorData, propsData]) => {
        setAsesor(asesorData)
        setPropiedades(propsData.data)
        setLoading(false)
      })
      .catch(() => {
        setError('No se pudo cargar la información del asesor.')
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#2C3E50] border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (error || !asesor) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Asesor no encontrado</h2>
        <p className="text-gray-500 mt-2">{error || 'El asesor que buscas no existe.'}</p>
        <Button className="mt-4" variant="outline" onClick={() => navigate('/asesores')}>
          Volver a asesores
        </Button>
      </div>
    )
  }

  const propiedadesActivas = propiedades.filter((p) => p.publicada).length

  return (
    <div className="container-custom py-8">
      <button
        onClick={() => navigate('/asesores')}
        className="text-[#2C3E50] hover:text-[#C47B4A] transition-colors mb-6 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a asesores
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-96 h-96 bg-gray-200">
            <img
              src={asesor.fotografia}
              alt={asesor.nombre}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50]">{asesor.nombre}</h1>
              <p className="text-[#C47B4A] font-medium mt-1">
                {asesor.especialidad || 'Asesor Inmobiliario'} &middot; Alpha Inmobiliaria
              </p>
              <div className="flex items-center gap-1 mt-2 text-[#C47B4A]">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-500 ml-1">(0)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <a
                href={`tel:${asesor.telefono}`}
                className="inline-block px-5 py-2 bg-[#2C3E50] text-white font-medium rounded-lg hover:bg-[#1A252F] transition-colors text-sm"
              >
                Contactar
              </a>
              <span className="text-sm text-gray-600">{asesor.telefono}</span>
              <span className="text-sm text-gray-400">&middot;</span>
              <span className="text-sm text-gray-600">Espanol, Ingles</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2C3E50]">{propiedades.length}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Propiedades</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2C3E50]">
                  {formatearPrecio(propiedades.reduce((sum, p) => sum + p.precio, 0))}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Vol. Ventas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2C3E50]">{propiedadesActivas}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Activas</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10 bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
        <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Acerca de {asesor.nombre}</h2>
        <div className="text-gray-600 leading-relaxed">
          {asesor.descripcion ? (
            <p>{asesor.descripcion}</p>
          ) : (
            <p className="text-gray-400 italic">Este asesor aún no ha añadido una descripción.</p>
          )}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-[#2C3E50] mb-6">
          Propiedades de {asesor.nombre} ({propiedades.length})
        </h2>
        {propiedades.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Este asesor no tiene propiedades publicadas actualmente.
          </p>
        ) : (
          <div className="space-y-4">
            {propiedades.map((prop) => (
              <PropiedadHorizontalCard key={prop.id} propiedad={prop} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 bg-[#F5F0EB] rounded-xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-[#2C3E50] mb-4">Opiniones de clientes</h2>
        <p className="text-gray-500">
          Las opiniones de clientes estaran disponibles proximamente.
        </p>
        <a
          href="#"
          className="inline-block mt-4 text-[#C47B4A] hover:text-[#A8653A] transition-colors text-sm font-medium"
        >
          Por que trabajar con un agente Alpha Inmobiliaria &rarr;
        </a>
      </section>
    </div>
  )
}
