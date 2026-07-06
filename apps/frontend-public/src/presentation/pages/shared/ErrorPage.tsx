import { Link } from 'react-router-dom'
import { Button } from '@/presentation/components/ui/Botones'

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-[#2C3E50]">404</h1>
      <h2 className="text-2xl font-bold mt-4 text-[#2C3E50]">¡Ups! Página no encontrada</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        La página que estás buscando no existe o fue movida a otra ubicación.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </div>
  )
}