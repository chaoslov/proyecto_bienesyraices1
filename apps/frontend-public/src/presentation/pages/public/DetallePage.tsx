import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { Button } from '@/presentation/components/ui/Botones'
import { PropiedadCard } from '@/presentation/components/shared/PropiedadCard'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { MensajeApi } from '@/infrastructure/api/repositories/MensajeApiRepository'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'
import type { Asesor } from '@/domain/entities/Asesor'

export const DetallePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchPorId } = usePropiedadStore()
  const [propiedad, setPropiedad] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [envioExitoso, setEnvioExitoso] = useState(false)
  const [similares, setSimilares] = useState<any[]>([])
  const [asesor, setAsesor] = useState<Asesor | null>(null)

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
        if (p.asesorId) {
          AsesorApi.obtenerPorId(p.asesorId).then(setAsesor).catch(() => {})
        }
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

  return (
    <div className="container-custom py-8">
      <div className="rounded-lg overflow-hidden mb-6">
        <img
          src={propiedad.imagenes?.[0] || 'https://picsum.photos/seed/default/1200/600'}
          alt={propiedad.titulo}
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-[#2C3E50]">{propiedad.titulo}</h1>
          <p className="text-[#2C3E50] text-2xl font-bold mt-2">{formatearPrecio(propiedad.precio)}</p>
          <p className="text-gray-600 mt-2">
            {propiedad.ubicacion?.direccion}, {propiedad.ubicacion?.ciudad}
          </p>
          
          <div className="flex gap-4 mt-4 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded">{propiedad.habitaciones} hab.</span>
            <span className="bg-gray-100 px-3 py-1 rounded">{propiedad.banos} baños</span>
            <span className="bg-gray-100 px-3 py-1 rounded">{propiedad.areaTotal} m²</span>
            <span className="bg-gray-100 px-3 py-1 rounded capitalize">{propiedad.tipoTransaccion}</span>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#2C3E50] mb-2">Descripción</h3>
            <p className="text-gray-700">{propiedad.descripcion}</p>
          </div>

          {propiedad.imagenes?.length > 1 && (
            <div className="mt-6">
              <h4 className="font-bold mb-2 text-[#2C3E50]">Galería</h4>
              <div className="grid grid-cols-4 gap-2">
                {propiedad.imagenes.slice(1, 5).map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Imagen ${idx + 2}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit sticky top-20 space-y-6">
          {asesor && (
            <div className="text-center pb-4 border-b border-gray-200">
              <img
                src={asesor.fotografia || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(asesor.nombre) + '&background=C47B4A&color=fff&size=128'}
                alt={asesor.nombre}
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow"
              />
              <h4 className="text-lg font-bold text-[#2C3E50] mt-3">{asesor.nombre}</h4>
              {asesor.especialidad && (
                <p className="text-sm text-gray-500">{asesor.especialidad}</p>
              )}
              <div className="flex justify-center gap-3 mt-4">
                {asesor.email && (
                  <a
                    href={`mailto:${asesor.email}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2C3E50] text-white text-xs font-medium rounded hover:bg-[#1a252f] transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Correo
                  </a>
                )}
                {asesor.telefono && (
                  <a
                    href={`https://wa.me/593${asesor.telefono.replace(/^0+/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-white text-xs font-medium rounded hover:bg-[#1da851] transition"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    WhatsApp
                  </a>
                )}
                {asesor.telefono && (
                  <a
                    href={`tel:${asesor.telefono}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C47B4A] text-white text-xs font-medium rounded hover:bg-[#a8663a] transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    Llamar
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold text-[#2C3E50] mb-4">Contactar Asesor</h3>
          <p className="text-sm text-gray-600 mb-4">
            ¿Te interesa esta propiedad? Completa el formulario y el asesor se pondrá en contacto contigo.
          </p>

          {envioExitoso ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
              Mensaje enviado con éxito. El asesor te contactará pronto.
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
                placeholder="Tu teléfono"
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
    </div>
  )
}
