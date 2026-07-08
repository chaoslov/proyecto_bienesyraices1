import { useEffect, useState } from 'react'
import { useAuthStore } from '@/application/store/authStore'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import { MensajeApi } from '@/infrastructure/api/repositories/MensajeApiRepository'
import {
  Building2, MessageSquare, DollarSign, TrendingUp,
} from 'lucide-react'

interface DashboardStats {
  totalPropiedades: number
  enVenta: number
  enAlquiler: number
  activas: number
  mensajesNoLeidos: number
  totalMensajes: number
}

export const DashboardPage = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats>({
    totalPropiedades: 0, enVenta: 0, enAlquiler: 0, activas: 0,
    mensajesNoLeidos: 0, totalMensajes: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      PropiedadApi.listarMias(1, 100),
      PropiedadApi.listarMias(1, 1, { tipoTransaccion: 'venta' }),
      PropiedadApi.listarMias(1, 1, { tipoTransaccion: 'alquiler' }),
      PropiedadApi.listarMias(1, 1, { estado: 'activa' }),
      MensajeApi.listarMios({ leido: false }),
      MensajeApi.listarMios(),
    ]).then(([todas, venta, alquiler, activas, noLeidos, todosMensajes]) => {
      setStats({
        totalPropiedades: todas.total,
        enVenta: venta.total,
        enAlquiler: alquiler.total,
        activas: activas.total,
        mensajesNoLeidos: noLeidos.length,
        totalMensajes: todosMensajes.length,
      })
    }).catch(() => {
      setStats({
        totalPropiedades: 0, enVenta: 0, enAlquiler: 0, activas: 0,
        mensajesNoLeidos: 0, totalMensajes: 0,
      })
    }).finally(() => setLoading(false))
  }, [user])

  const tarjetas = [
    {
      titulo: 'Mis Propiedades',
      valor: stats.totalPropiedades,
      icono: Building2,
      color: 'bg-blue-500',
    },
    {
      titulo: 'En Venta',
      valor: stats.enVenta,
      icono: DollarSign,
      color: 'bg-green-500',
    },
    {
      titulo: 'En Alquiler',
      valor: stats.enAlquiler,
      icono: TrendingUp,
      color: 'bg-yellow-500',
    },
    {
      titulo: 'Mensajes No Leídos',
      valor: stats.mensajesNoLeidos,
      icono: MessageSquare,
      color: 'bg-red-500',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#2C3E50] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Resumen de tu actividad, {user?.asesor?.nombre}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tarjetas.map(({ titulo, valor, icono: Icon, color }) => (
          <div key={titulo} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{titulo}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{valor}</p>
              </div>
              <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
