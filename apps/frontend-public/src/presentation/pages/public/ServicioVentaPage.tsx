import { useState } from 'react'
import { Button } from '@/presentation/components/ui/Botones'

export const ServicioVentaPage = () => {
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', direccion: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="container-custom py-8">
      <section className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-10">
        <img
          src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1200&h=600&fit=crop"
          alt="Vende tu propiedad"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50]/80 to-transparent flex items-center">
          <div className="text-white px-8 md:px-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Vende tu Propiedad</h1>
            <p className="text-lg md:text-xl max-w-xl text-white/80">
              Publica tu propiedad y conecta con miles de compradores interesados.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">¿Por que vender con nosotros?</h2>
          <div className="space-y-6">
            {[
              { titulo: 'Expertos Locales', desc: 'Conocemos el mercado inmobiliario de Guayaquil y sus alrededores como nadie.' },
              { titulo: 'Maxima Exposicion', desc: 'Tu propiedad llegara a miles de compradores potenciales a traves de nuestra plataforma y redes sociales.' },
              { titulo: 'Asesoria Personalizada', desc: 'Te asignamos un asesor dedicado que te acompanara en todo el proceso de venta.' },
              { titulo: 'Sin Complicaciones', desc: 'Nos encargamos de las visitas, negociaciones y tramites para que tu solo recibas la mejor oferta.' },
            ].map((item) => (
              <div key={item.titulo} className="flex gap-4">
                <div className="w-12 h-12 bg-[#C47B4A]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-6 h-6 text-[#C47B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#2C3E50]">{item.titulo}</h3>
                  <p className="text-gray-600 text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Solicita una valoracion</h2>

          {enviado ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-6 rounded-lg text-center">
              <p className="text-lg font-medium">Solicitud enviada con exito</p>
              <p className="text-sm mt-2">Un asesor se comunicara contigo en las proximas 24 horas.</p>
              <Button variant="outline" className="mt-4" onClick={() => setEnviado(false)}>
                Enviar otra solicitud
              </Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Tu correo electronico"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Tu telefono"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Direccion de la propiedad"
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                required
              />
              <textarea
                placeholder="Cuentanos mas sobre tu propiedad (opcional)"
                rows={3}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C47B4A]"
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
              />
              <Button variant="primary" className="w-full py-3">
                Enviar solicitud
              </Button>
            </form>
          )}
        </div>
      </div>

      <section className="mt-16 bg-[#F5F0EB] rounded-xl p-8 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">¿Listo para vender?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Completa el formulario y uno de nuestros asesores especializados se pondra en contacto
          contigo para ofrecerte una valoracion gratuita y personalizada de tu propiedad.
        </p>
        <Button variant="primary" size="md" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}>
          Solicitar Valoracion
        </Button>
      </section>
    </div>
  )
}
