import { Link, useNavigate } from 'react-router-dom'
import { useUIStore } from '@/application/store/uiStore'
import { useAuthStore } from '@/application/store/authStore'

export const Navbar = () => {
  const { sidebarAbierto, toggleSidebar } = useUIStore()
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <nav className="bg-[#2C3E50] shadow-md sticky top-0 z-40">
      <div className="container-custom flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-white">
          Alpha Inmobiliaria
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white/80 hover:text-white transition">
            Inicio
          </Link>
          <Link to="/propiedades" className="text-white/80 hover:text-white transition">
            Propiedades
          </Link>
          <Link to="/asesores" className="text-white/80 hover:text-white transition">
            Asesores
          </Link>
          {token && user ? (
            <div className="flex items-center gap-3">
              <Link to="/panel" className="bg-[#C47B4A] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#b06a3d] transition">
                Panel
              </Link>
              <button onClick={() => { logout(); navigate('/') }} className="text-white/70 hover:text-white text-sm">
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-white hover:underline">
              Iniciar Sesión
            </Link>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${sidebarAbierto ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${sidebarAbierto ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${sidebarAbierto ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Sidebar Móvil */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${sidebarAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
      >
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b">
            <Link to="/" className="text-2xl font-bold text-[#2C3E50]">
              Alpha
            </Link>
            <button onClick={toggleSidebar} className="float-right text-2xl text-gray-600">
              ×
            </button>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <Link to="/" className="text-gray-800 hover:text-[#C47B4A] transition" onClick={toggleSidebar}>
              Inicio
            </Link>
            <Link to="/propiedades" className="text-gray-800 hover:text-[#C47B4A] transition" onClick={toggleSidebar}>
              Propiedades
            </Link>
            <Link to="/asesores" className="text-gray-800 hover:text-[#C47B4A] transition" onClick={toggleSidebar}>
              Asesores
            </Link>
            <hr />
            {token && user ? (
              <>
                <Link to="/panel" className="text-[#C47B4A] font-medium" onClick={toggleSidebar}>
                  Panel
                </Link>
                <button onClick={() => { logout(); navigate('/'); toggleSidebar() }} className="text-red-500 text-sm text-left">
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="text-[#C47B4A] hover:underline" onClick={toggleSidebar}>
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}