import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LayoutPublico } from './presentation/components/layout/LayoutPublico'
import { LayoutPrivado } from './presentation/components/layout/LayoutPrivado'
import { PrivateRoute } from './presentation/components/auth/PrivateRoute'
import { useAuthStore } from './application/store/authStore'
import { PrincipalPage } from './presentation/pages/public/PrincipalPage'
import { CatalogoPage } from './presentation/pages/public/CatalogoPage'
import { DetallePage } from './presentation/pages/public/DetallePage'
import { AsesoresPage } from './presentation/pages/public/AsesoresPage'
import { PerfilAsesorPage } from './presentation/pages/public/PerfilAsesorPage'
import { NotFoundPage } from './presentation/pages/shared/ErrorPage'
import { LoginPage } from './presentation/pages/private/LoginPage'
import { DashboardPage } from './presentation/pages/private/DashboardPage'
import { MisPropiedadesPage } from './presentation/pages/private/MisPropiedadesPage'
import { NuevaPropiedadPage } from './presentation/pages/private/NuevaPropiedadPage'
import { EditarPropiedadPage } from './presentation/pages/private/EditarPropiedadPage'
import { MensajesPage } from './presentation/pages/private/MensajesPage'
import { PerfilPage } from './presentation/pages/private/PerfilPage'
import { ServicioVentaPage } from './presentation/pages/public/ServicioVentaPage'

function App() {
  const { token, checkAuth } = useAuthStore()

  useEffect(() => {
    if (token) checkAuth()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<LayoutPublico />}>
        <Route index element={<PrincipalPage />} />
        <Route path="propiedades" element={<CatalogoPage />} />
        <Route path="propiedad/:id" element={<DetallePage />} />
        <Route path="asesores" element={<AsesoresPage />} />
        <Route path="asesores/:id" element={<PerfilAsesorPage />} />
        <Route path="servicios/venta" element={<ServicioVentaPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="admin" element={<Navigate to="/login" replace />} />
        <Route path="panel" element={<PrivateRoute />}>
          <Route element={<LayoutPrivado />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="propiedades" element={<MisPropiedadesPage />} />
            <Route path="propiedades/nueva" element={<NuevaPropiedadPage />} />
            <Route path="propiedades/editar/:id" element={<EditarPropiedadPage />} />
            <Route path="mensajes" element={<MensajesPage />} />
            <Route path="perfil" element={<PerfilPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
