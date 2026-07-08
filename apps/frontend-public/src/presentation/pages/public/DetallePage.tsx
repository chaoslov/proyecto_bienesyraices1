import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { Button } from '@/presentation/components/ui/Botones'
import { PropiedadCard } from '@/presentation/components/shared/PropiedadCard'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { MensajeApi } from '@/infrastructure/api/repositories/MensajeApiRepository'
import { useAsesorStore } from '@/application/store/asesorStore'

function BedIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 8v8a1 1 0 001 1h18a1 1 0 001-1V8M2 8l1.5-3h17L22 8M2 8h20M6 12h4m4 0h4" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a1 1 0 01-1-1v-2a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1M7 12V6a2 2 0 012-2h4M5 20h14" />
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.592l9.09 9.09a2.25 2.25 0 003.182 0l4.318-4.318a2.25 2.25 0 000-3.182l-9.09-9.09A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 7.5h.008v.008H7.5V7.5z" />
    </svg>
  )
}

function AsesorAvatar({ asesor }: { asesor: { nombre: string; fotografia?: string } }) {
  const [error, setError] = useState(false)
  return error || !asesor.fotografia ? (
    <span>{asesor.nombre?.[0] || '?'}</span>
  ) : (
    <img src={asesor.fotografia} alt={asesor.nombre} className="w-full h-full object-cover" onError={() => setError(true)} />
  )
}

export const DetallePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchPorId } = usePropiedadStore()
  const { asesores, fetchAsesores } = useAsesorStore()
  const [propiedad, setPropiedad] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [envioExitoso, setEnvioExitoso] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [similares, setSimilares] = useState<any[]>([])

  useEffect(() => {
    if (asesores.length === 0) {
      fetchAsesores()
    }
  }, [asesores.length, fetchAsesores])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchPorId(id).then((p) => {
      setPropiedad(p)
      setLoading(false)
      if (p) {
        setFormData((prev) => ({ ...prev, mensaje: `Consulto sobre: ${p.titulo}` }))
        PropiedadApi.listar({ tipoPropiedad: p.tipoInmueble }, 1, 4).then((res) => {
          setSimilares(res.data.filter((s: any) => s.id !== p.id).slice(0, 3))
        }).catch(() => {})
      }
    })
  }, [id, fetchPorId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.nombre || !formData.email || !formData.mensaje) return
    setEnviando(true)
    try {
      await MensajeApi.enviar({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono || undefined,
        mensaje: formData.mensaje,
        propiedadId: id,
        asesorId: propiedad?.asesorId,
      })
      setEnvioExitoso(true)
      setFormData({ nombre: '', email: '', telefono: '', mensaje: '' })
    } catch (err) {
      alert('Error al enviar el mensaje. Intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  const asesor = (() => {
    if (!propiedad) return null
    const storeAsesor = propiedad.asesorId ? asesores.find((a) => a.id === propiedad.asesorId) : null
    return storeAsesor ?? propiedad.asesor ?? null
  })()

  if (loading) {
    return (
      <div className="container-custom py-12 text-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#2C3E50] border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  if (!propiedad) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700">Propiedad no encontrada</h2>
        <Button className="mt-4" onClick={() => navigate('/propiedades')}>
          Volver al catálogo
        </Button>
      </div>
    )
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  const tipoLabel = propiedad.tipoTransaccion === 'venta' ? 'Venta' : 'Alquiler'

  return (
    <div className="container-custom py-8 pb-24">
      <div className="flex flex-col md:flex-row gap-2 mb-6 rounded-lg overflow-hidden">
        <div className="relative md:w-[70%] min-h-[250px] md:min-h-[380px] bg-gray-200">
          <img
            src={propiedad.imagenes?.[currentImage] || propiedad.imagenes?.[0] || 'https://picsum.photos/seed/default/1200/600'}
            alt={propiedad.titulo}
            className="w-full h-full absolute inset-0 object-cover"
          />
          {propiedad.imagenes?.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((prev) => (prev === 0 ? propiedad.imagenes.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition z-10"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentImage((prev) => (prev === propiedad.imagenes.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition z-10"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full z-10">
                {currentImage + 1} / {propiedad.imagenes.length}
              </div>
            </>
          )}
          <span className={`absolute top-4 left-4 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded z-10 ${propiedad.tipoTransaccion === 'venta' ? 'bg-[#C47B4A] text-white' : 'bg-[#2C3E50] text-white'}`}>
            {tipoLabel}
          </span>
        </div>

        {propiedad.imagenes?.length > 1 && (
          <div className="hidden md:flex flex-col md:w-[30%] gap-2 overflow-y-auto max-h-[380px]">
            {propiedad.imagenes.map((img: string, idx: number) => (
              <div
                key={idx}
                className={`relative flex-shrink-0 h-[68px] rounded-lg overflow-hidden cursor-pointer border-2 transition ${idx === currentImage ? 'border-[#C47B4A]' : 'border-transparent hover:border-gray-300'}`}
                onClick={() => setCurrentImage(idx)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-[#2C3E50]">{propiedad.titulo}</h1>
          <p className="text-[#2C3E50] text-2xl font-bold mt-2">{formatearPrecio(propiedad.precio)}</p>
          <p className="text-gray-500 mt-1">
            {propiedad.ubicacion?.direccion}, {propiedad.ubicacion?.ciudad}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="group bg-white border border-orange-200 rounded-xl px-2 py-3 flex flex-col items-center justify-center gap-1.5 hover:shadow-lg hover:border-[#C47B4A] transition-all duration-300 cursor-default h-28">
              <div className="w-11 h-11 bg-[#C47B4A]/10 rounded-xl flex items-center justify-center text-[#C47B4A] group-hover:bg-[#C47B4A] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                <BedIcon />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{propiedad.habitaciones}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Dormitorios</p>
              </div>
            </div>
            <div className="group bg-white border border-orange-200 rounded-xl px-2 py-3 flex flex-col items-center justify-center gap-1.5 hover:shadow-lg hover:border-[#C47B4A] transition-all duration-300 cursor-default h-28">
              <div className="w-11 h-11 bg-[#C47B4A]/10 rounded-xl flex items-center justify-center text-[#C47B4A] group-hover:bg-[#C47B4A] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                <BathIcon />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{propiedad.banos}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Baños</p>
              </div>
            </div>
            <div className="group bg-white border border-orange-200 rounded-xl px-2 py-3 flex flex-col items-center justify-center gap-1.5 hover:shadow-lg hover:border-[#C47B4A] transition-all duration-300 cursor-default h-28">
              <div className="w-11 h-11 bg-[#C47B4A]/10 rounded-xl flex items-center justify-center text-[#C47B4A] group-hover:bg-[#C47B4A] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                <AreaIcon />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{propiedad.areaTotal}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">M²</p>
              </div>
            </div>
            <div className="group bg-white border border-orange-200 rounded-xl px-2 py-3 flex flex-col items-center justify-center gap-1.5 hover:shadow-lg hover:border-[#C47B4A] transition-all duration-300 cursor-default h-28">
              <div className="w-11 h-11 bg-[#C47B4A]/10 rounded-xl flex items-center justify-center text-[#C47B4A] group-hover:bg-[#C47B4A] group-hover:text-white transition-colors duration-300 flex-shrink-0">
                <TagIcon />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800 capitalize">{propiedad.tipoInmueble}</p>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Tipo</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-[#2C3E50] mb-3">Descripción</h3>
            <p className="text-gray-700 leading-relaxed">{propiedad.descripcion}</p>
          </div>

        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit sticky top-20">
          {asesor && (
            <div className="text-center mb-6 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 rounded-full bg-[#2C3E50] text-white flex items-center justify-center text-2xl font-bold mx-auto overflow-hidden">
                <AsesorAvatar asesor={asesor} />
              </div>
              <Link to={`/asesores/${asesor.id}`} className="block text-lg font-bold text-[#2C3E50] hover:text-[#C47B4A] transition-colors mt-3">
                {asesor.nombre}
              </Link>
              <p className="text-sm text-gray-500">
                {propiedad.tipoTransaccion === 'venta' ? 'Asesor de ventas' : 'Asesor de alquileres'}
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href={`mailto:${asesor.email || ''}`}
                  className="w-10 h-10 rounded-full bg-[#C47B4A]/10 flex items-center justify-center text-[#C47B4A] hover:bg-[#C47B4A] hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/593${asesor.telefono?.replace(/^0/, '')}?text=${encodeURIComponent(`Hola ${asesor.nombre}, estoy interesado en: ${propiedad.titulo}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">{asesor.telefono}</span>
              </div>
            </div>
          )}
          <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Contactar Asesor</h3>
          <p className="text-sm text-gray-600 mb-4">
            Te interesa esta propiedad? Completa el formulario y el asesor se pondra en contacto contigo.
          </p>

          {envioExitoso ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 h-28 rounded-lg text-center">
              Mensaje enviado con exito. El asesor te contactara pronto.
              <Button className="mt-2" variant="outline" size="pq" onClick={() => setEnvioExitoso(false)}>
                Enviar otro mensaje
              </Button>
            </div>
          ) : (
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Tu correo"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Tu telefono"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
              <textarea
                placeholder="Mensaje..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                required
              />
              <Button variant="primary" className="w-full" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </Button>
            </form>
          )}
        </div>
      </div>

      {similares.length > 0 && (
        <section className="mt-12 border-t pt-8">
          <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">Propiedades Similares</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similares.map((prop) => (
              <PropiedadCard key={prop.id} propiedad={prop} />
            ))}
          </div>
        </section>
      )}

      {asesor && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50 md:hidden">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2C3E50] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden">
                <AsesorAvatar asesor={asesor} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{asesor.nombre}</p>
                <p className="text-xs text-gray-500">Asesor</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${asesor.telefono}`}
                className="p-2.5 bg-[#2C3E50] text-white rounded-lg hover:bg-[#1A252F] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a
                href={`https://wa.me/593${asesor.telefono?.replace(/^0/, '')}?text=${encodeURIComponent(`Hola ${asesor.nombre}, estoy interesado en: ${propiedad.titulo}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
