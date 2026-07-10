import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'
import { Users, MessageSquare, LogOut } from 'lucide-react'

const enlaces = [
  { to: '/panel/admin/asesores', icon: Users, label: 'Asesores' },
  { to: '/panel/admin/mensajes', icon: MessageSquare, label: 'Mensajes' },
]

function esActivo(path: string, to: string): boolean {
  if (path === to || path === to + '/') return true
  return path.startsWith(to + '/')
}

export const AdminLayout = () => {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="bg-[#2C3E50] p-5 text-white">
          <p className="text-sm font-semibold">Panel Admin</p>
          <p className="text-xs text-white/70 truncate">{user?.email}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {enlaces.map(({ to, icon: Icon, label }) => {
            const activo = esActivo(location.pathname, to)
            return (
              <Link
                key={to}
                to={to}
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

        <div className="p-3 border-t border-gray-200 space-y-1">
          <Link
            to="/panel/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Panel Asesor
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
