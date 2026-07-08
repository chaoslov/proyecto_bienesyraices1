import { Routes, Route } from 'react-router-dom'
import { LayoutPublico } from './presentation/components/layout/LayoutPublico'
import { PrincipalPage } from './presentation/pages/public/PrincipalPage'
import { CatalogoPage } from './presentation/pages/public/CatalogoPage'
import { DetallePage } from './presentation/pages/public/DetallePage'
import { AsesoresPage } from './presentation/pages/public/AsesoresPage'
import { PerfilAsesorPage } from './presentation/pages/public/PerfilAsesorPage'
import { NotFoundPage } from './presentation/pages/shared/ErrorPage'
import { ServicioVentaPage } from './presentation/pages/public/ServicioVentaPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutPublico />}>
        <Route index element={<PrincipalPage />} />
        <Route path="propiedades" element={<CatalogoPage />} />
        <Route path="propiedad/:id" element={<DetallePage />} />
        <Route path="asesores" element={<AsesoresPage />} />
        <Route path="asesores/:id" element={<PerfilAsesorPage />} />
        <Route path="servicios/venta" element={<ServicioVentaPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
