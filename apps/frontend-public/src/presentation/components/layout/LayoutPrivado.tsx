import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'
import {
  LayoutDashboard, Building2, MessageSquare, User, LogOut, Menu, X, ChevronDown,
} from 'lucide-react'

const enlaces = [
  { to: '/panel', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/panel/propiedades', icon: Building2, label: 'Mis Propiedades' },
  { to: '/panel/mensajes', icon: MessageSquare, label: 'Mensajes' },
  { to: '/panel/perfil', icon: User, label: 'Mi Perfil' },
]

export const LayoutPrivado = () => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [perfilAbierto, setPerfilAbierto] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const cerrarSesion = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2C3E50] text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <Link to="/panel" className="text-xl font-bold tracking-tight">
            Alpha Panel
          </Link>
          <button onClick={() => setSidebarAbierto(false)} className="lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {enlaces.map(({ to, icon: Icon, label }) => {
            const activo = location.pathname === to || location.pathname.startsWith(to + '/')
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarAbierto(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activo
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="text-xs text-white/50 text-center">
            Alpha Inmobiliaria &copy; {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <button
              onClick={() => setSidebarAbierto(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="hidden lg:block" />

            <div className="relative">
              <button
                onClick={() => setPerfilAbierto(!perfilAbierto)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#C47B4A] flex items-center justify-center text-white text-sm font-bold">
                  {user?.asesor?.nombre?.charAt(0) || 'A'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.asesor?.nombre || 'Asesor'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {perfilAbierto && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setPerfilAbierto(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-20">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium text-gray-800">{user?.asesor?.nombre}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/panel/perfil"
                        onClick={() => setPerfilAbierto(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                      >
                        <User className="w-4 h-4" />
                        Mi Perfil
                      </Link>
                      <button
                        onClick={cerrarSesion}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
