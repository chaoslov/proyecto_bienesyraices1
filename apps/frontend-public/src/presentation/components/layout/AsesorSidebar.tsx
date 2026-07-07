import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'
import { useUIStore } from '@/application/store/uiStore'
import {
  LayoutDashboard, Building2, MessageSquare, User, LogOut,
} from 'lucide-react'

const enlaces = [
  { to: '/panel', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/panel/propiedades', icon: Building2, label: 'Mis Propiedades' },
  { to: '/panel/mensajes', icon: MessageSquare, label: 'Mensajes' },
  { to: '/panel/perfil', icon: User, label: 'Mi Perfil' },
]

function esActivo(path: string, to: string): boolean {
  if (path === to || path === to + '/') return true
  if (to === '/panel') {
    return path.startsWith('/panel/dashboard')
  }
  return path.startsWith(to + '/')
}

export const AsesorSidebar = () => {
  const { panelAbierto, cerrarPanel } = useUIStore()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  if (!user) return null

  return (
    <>
      {panelAbierto && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={cerrarPanel}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          panelAbierto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-[#2C3E50] p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#C47B4A] flex items-center justify-center text-white text-lg font-bold flex-shrink-0 overflow-hidden">
              {user.asesor?.foto ? (
                <img src={user.asesor.foto} alt="" className="w-full h-full object-cover" />
              ) : (
                user.asesor?.nombre?.charAt(0) || 'A'
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.asesor?.nombre || 'Asesor'}</p>
              <p className="text-xs text-white/70 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={cerrarPanel}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {enlaces.map(({ to, icon: Icon, label }) => {
            const activo = esActivo(location.pathname, to)
            return (
              <Link
                key={to}
                to={to}
                onClick={cerrarPanel}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activo
                    ? 'bg-[#2C3E50]/10 text-[#2C3E50]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={() => { logout(); cerrarPanel(); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}