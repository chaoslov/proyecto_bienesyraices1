import { Link } from 'react-router-dom'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Button } from '@/presentation/components/ui/Botones'

interface PropiedadCardProps {
  propiedad: Propiedad
  showActions?: boolean
}

export const PropiedadCard = ({ propiedad, showActions = false }: PropiedadCardProps) => {
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={propiedad.imagenes[0] || 'https://picsum.photos/seed/default/400/300'}
          alt={propiedad.titulo}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {propiedad.destacada && (
          <span className="absolute top-3 left-3 bg-[#C47B4A] text-white text-xs font-semibold px-2.5 py-1 rounded">
            Destacada
          </span>
        )}
        {showActions && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
            Tu propiedad
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate">{propiedad.titulo}</h3>
        <p className="text-[#2C3E50] font-bold text-xl mt-1">{formatearPrecio(propiedad.precio)}</p>
        <p className="text-gray-500 text-sm">{propiedad.ubicacion.ciudad}</p>
        
        <div className="flex gap-3 text-sm text-gray-600 mt-2">
          <span>{propiedad.habitaciones} hab.</span>
          <span>{propiedad.banos} baños</span>
          <span>{propiedad.areaTotal} m²</span>
        </div>

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Link to={`/propiedad/${propiedad.id}`} className="flex-1">
            <Button variant="primary" size="pq" className="w-full">
              Ver Detalle
            </Button>
          </Link>
          {showActions && (
            <>
              <Button variant="outline" size="pq">Editar</Button>
              <Button variant="danger" size="pq">Eliminar</Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}