import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/application/store/authStore'

export const PrivateRoute = () => {
  const { token, user, checkAuth } = useAuthStore()
  const location = useLocation()
  const [verificando, setVerificando] = useState(!!token && !user)

  useEffect(() => {
    if (token && !user) {
      checkAuth().finally(() => setVerificando(false))
    } else {
      setVerificando(false)
    }
  }, [token, user, checkAuth])

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-8 w-8 border-4 border-[#2C3E50] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user?.asesor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Acceso restringido</h2>
          <p className="text-gray-600">Solo los asesores pueden acceder al panel.</p>
          <button onClick={() => useAuthStore.getState().logout()} className="mt-4 bg-[#2C3E50] text-white px-4 py-2 rounded-lg text-sm">
            Cerrar sesión e ir al login
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
