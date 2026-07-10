import { useEffect, useState } from 'react'
import { MensajeApi } from '@/infrastructure/api/repositories/MensajeApiRepository'
import { AsesorApi } from '@/infrastructure/api/repositories/AsesorApiRepository'

export const ServicioVentaPage = () => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', ciudad: '', tipoPropiedad: '',
  })
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [adminAsesorId, setAdminAsesorId] = useState<string | null>(null)
  const [errorAsesor, setErrorAsesor] = useState<string | null>(null)

  useEffect(() => {
    AsesorApi.listar()
      .then((asesores) => {
        if (asesores.length > 0) {
          setAdminAsesorId(asesores[0].id)
          return
        }
        setErrorAsesor('No se encontró ningún asesor disponible para recibir la solicitud.')
      })
      .catch(() => {
        setErrorAsesor('No se pudo cargar el destinatario de la solicitud. Intenta de nuevo más tarde.')
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (enviando) return
    if (!adminAsesorId) {
      setErrorAsesor('Aún no se puede procesar la solicitud. Intenta de nuevo en unos segundos.')
      return
    }

    setEnviando(true)

    try {
      await MensajeApi.enviar({
        nombre: `${form.nombre} ${form.apellido}`.trim(),
        email: form.email,
        telefono: form.telefono || undefined,
        mensaje: `Solicitud de venta de propiedad:\nNombre: ${form.nombre} ${form.apellido}\nEmail: ${form.email}\nTeléfono: ${form.telefono}\nCiudad: ${form.ciudad}\nTipo de propiedad: ${form.tipoPropiedad}`,
        tipo: 'venta',
        asesorId: adminAsesorId,
      })
      setEnviado(true)
      setForm({ nombre: '', apellido: '', email: '', telefono: '', ciudad: '', tipoPropiedad: '' })
      setErrorAsesor(null)
    } catch (error) {
      const msg = (error as any)?.message || 'Error al enviar la solicitud. Intenta de nuevo más tarde.'
      setErrorAsesor(msg)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-[#2C3E50] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50] via-[#2C3E50]/95 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-4 rounded-full bg-[#C47B4A]/30 text-[#C47B4A] text-sm font-semibold tracking-wider mb-4 border border-[#C47B4A]/50">
              Vende sin estres
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              Vende tu propiedad al <span className="text-[#C47B4A]">mejor precio</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Confia la venta de tu inmueble a profesionales. Maximiza tus ganancias y vende en tiempo
              record con nuestra estrategia de marketing inmobiliario avanzado.
            </p>
            <a
              href="#formulario-venta"
              className="inline-flex items-center justify-center bg-[#C47B4A] hover:bg-[#A8663A] text-white font-bold py-4 px-8 rounded-xl transition duration-300 shadow-xl text-lg"
            >
              Quiero vender mi propiedad!
              <svg className="w-5 h-5 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div id="formulario-venta" className="bg-gray-50 py-20" style={{ scrollMarginTop: 80 }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
            <div className="p-8 md:p-14 md:w-1/2 flex flex-col justify-center">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#2C3E50] mb-3">Inicia el proceso hoy</h2>
                <p className="text-gray-500">Llena el formulario y un agente asociado se pondra en contacto contigo en menos de 24 horas.</p>
              </div>

              {enviado ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl text-center">
                  <p className="text-lg font-medium">Solicitud enviada con exito</p>
                  <p className="text-sm mt-2">Un asesor se comunicara contigo en las proximas 24 horas.</p>
                  <button
                    className="mt-4 px-5 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                    onClick={() => setEnviado(false)}
                  >
                    Enviar otra solicitud
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">Nombre</label>
                      <input
                        type="text"
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:bg-white transition-colors"
                        value={form.nombre}
                        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">Apellido</label>
                      <input
                        type="text"
                        placeholder="Tu apellido"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:bg-white transition-colors"
                        value={form.apellido}
                        onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:bg-white transition-colors"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">Telefono</label>
                      <div className="flex">
                        <select className="px-3 py-3 bg-gray-100 border border-gray-200 border-r-0 rounded-l-xl focus:outline-none text-sm text-gray-600 font-medium">
                          <option>+593</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Tu numero"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:bg-white transition-colors"
                          value={form.telefono}
                          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">Ciudad</label>
                      <input
                        type="text"
                        placeholder="Ej. Guayaquil"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:bg-white transition-colors"
                        value={form.ciudad}
                        onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">Tipo de propiedad a vender</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:bg-white appearance-none transition-colors"
                        value={form.tipoPropiedad}
                        onChange={(e) => setForm({ ...form, tipoPropiedad: e.target.value })}
                        required
                      >
                        <option value="">Seleccione un tipo</option>
                        <option value="departamento">Departamento</option>
                        <option value="casa">Casa</option>
                        <option value="terreno">Terreno</option>
                        <option value="local">Local Comercial</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {errorAsesor && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-3">
                      {errorAsesor}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={enviando || !adminAsesorId}
                    className={`w-full ${enviando || !adminAsesorId ? 'bg-gray-300 hover:bg-gray-300 cursor-not-allowed' : 'bg-[#C47B4A] hover:bg-[#A8663A]'} text-white font-bold py-4 px-6 rounded-xl mt-6 transition duration-300 shadow-lg flex justify-center items-center gap-2 text-lg`}
                  >
                    <span>{enviando ? 'Enviando...' : 'Enviar solicitud'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              )}
            </div>

            <div className="md:w-1/2 relative hidden md:block min-h-[600px]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1000&q=80"
                alt="Asesor inmobiliario"
                className="w-full h-full object-cover absolute inset-0"
              />
              <div className="absolute bottom-10 left-10 right-10 z-20 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#C47B4A] flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">Valoracion Gratuita</h4>
                    <p className="text-sm text-gray-200 mt-1">Evaluamos el precio real de tu propiedad en el mercado actual sin ningun costo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}