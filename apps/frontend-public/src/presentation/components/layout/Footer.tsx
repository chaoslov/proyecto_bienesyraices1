export const Footer = () => {
  return (
    <footer className="bg-[#1A252F] text-white py-8 mt-auto">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-3">Alpha Inmobiliaria</h3>
            <p className="text-gray-400 text-sm">Tu hogar está aquí</p>
            <p className="text-gray-400 text-sm mt-2">(04) 123-4567</p>
            <p className="text-gray-400 text-sm">info@alphainmobiliaria.com</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Enlaces</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition">Inicio</a></li>
              <li><a href="/propiedades" className="hover:text-white transition">Propiedades</a></li>
              <li><a href="/asesores" className="hover:text-white transition">Asesores</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Compra de inmuebles</li>
              <li>Venta de propiedades</li>
              <li>Alquiler residencial</li>
              <li>Asesoría legal</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Síguenos</h4>
            <div className="flex gap-3 text-2xl">
              <a href="#" className="text-gray-400 hover:text-white transition"></a>
              <a href="#" className="text-gray-400 hover:text-white transition"></a>
              <a href="#" className="text-gray-400 hover:text-white transition"></a>
            </div>
            <p className="text-gray-500 text-xs mt-4">© 2026 Alpha Inmobiliaria</p>
          </div>
        </div>
      </div>
    </footer>
  )
}