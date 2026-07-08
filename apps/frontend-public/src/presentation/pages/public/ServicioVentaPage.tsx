import { useState } from 'react'

export const ServicioVentaPage = () => {
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '', ciudad: '', tipoPropiedad: '',
  })
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="container-custom py-8">
      <section className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#2C3E50] mb-4">
          Vende tu Propiedad con Nosotros
        </h1>
        <p className="text-gray-600 max-w-2xl leading-relaxed mb-6">
          Confia la venta de tu inmueble a profesionales. Maximiza tus ganancias y vende en tiempo
          record con nuestra estrategia de marketing inmobiliario.
        </p>
        <a
          href="#formulario-venta"
          className="inline-block bg-[#C47B4A] hover:bg-[#A8663A] text-white font-bold px-8 py-3.5 rounded-lg transition-colors"
        >
          ¡Quiero vender mi propiedad!
        </a>
      </section>

      <section id="formulario-venta" className="scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-white p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#2C3E50] mb-2">
              Vende tu propiedad
            </h2>
            <p className="text-gray-500 mb-8">
              Llena el formulario y un asesor se pondra en contacto contigo para continuar con el proceso.
            </p>

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
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
                  <input
                    type="text"
                    placeholder="Apellido"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    placeholder="E-mail"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefono</label>
                  <div className="flex gap-2">
                    <select
                      className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition w-[130px] flex-shrink-0"
                      defaultValue="+593"
                    >
                      <option value="+593">+593</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Telefono de contacto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition"
                      value={form.telefono}
                      onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ciudad</label>
                  <input
                    type="text"
                    placeholder="Ciudad de donde nos contacta"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition"
                    value={form.ciudad}
                    onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo de propiedad</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#C47B4A] focus:border-transparent transition"
                    value={form.tipoPropiedad}
                    onChange={(e) => setForm({ ...form, tipoPropiedad: e.target.value })}
                    required
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="departamento">Departamento</option>
                    <option value="casa">Casa</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C47B4A] hover:bg-[#A8663A] text-white font-bold py-3.5 rounded-lg transition-colors"
                >
                  Enviar
                </button>
              </form>
            )}
          </div>

          <div className="bg-[#2C3E50] min-h-[300px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&h=1000&fit=crop"
              alt="Asesoria Inmobiliaria"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
