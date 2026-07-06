import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { usePropiedadStore } from '@/application/store/propiedadStore'
import { Button } from '@/presentation/components/ui/Botones'
import { MensajeApi } from '@/infrastructure/api/repositories/MensajeApiRepository'

export const DetallePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { fetchPorId } = usePropiedadStore()
  const [propiedad, setPropiedad] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [envioExitoso, setEnvioExitoso] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchPorId(id).then((p) => {
      setPropiedad(p)
      setLoading(false)
      if (p) {
        setFormData((prev) => ({ ...prev, mensaje: `Consulto sobre: ${p.titulo}` }))
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

        <div className="bg-gray-50 p-6 rounded-lg shadow-md h-fit sticky top-20">
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
    </div>
  )
}
