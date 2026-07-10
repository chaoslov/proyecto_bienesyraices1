import { Link } from 'react-router-dom'
import { Propiedad } from '@/domain/entities/Propiedad'
import { Button } from '@/presentation/components/ui/Botones'

interface PropiedadCardProps {
  propiedad: Propiedad
  showActions?: boolean
  onSelect?: (id: string) => void
}

function BedIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2 8v8a1 1 0 001 1h18a1 1 0 001-1V8M2 8l1.5-3h17L22 8M2 8h20M6 12h4m4 0h4" />
    </svg>
  )
}

function BathIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16a1 1 0 01-1-1v-2a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1M7 12V6a2 2 0 012-2h4M5 20h14" />
    </svg>
  )
}

function AreaIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z" />
    </svg>
  )
}

export const PropiedadCard = ({ propiedad, showActions = false, onSelect }: PropiedadCardProps) => {
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(precio)
  }

  return (
    <div onClick={() => onSelect?.(propiedad.id)} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer">
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
        
        <div className="flex flex-wrap gap-2 mt-3">
          {propiedad.habitaciones > 0 && (
            <span className="inline-flex items-center bg-[#2C3E50]/5 text-[#2C3E50] text-xs font-medium px-2.5 py-1 rounded-full">
              <BedIcon /> {propiedad.habitaciones}
            </span>
          )}
          {propiedad.banos > 0 && (
            <span className="inline-flex items-center bg-[#C47B4A]/10 text-[#C47B4A] text-xs font-medium px-2.5 py-1 rounded-full">
              <BathIcon /> {propiedad.banos}
            </span>
          )}
          <span className="inline-flex items-center bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
            <AreaIcon /> {propiedad.areaTotal} m²
          </span>
          <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${propiedad.tipoTransaccion === 'venta' ? 'bg-[#C47B4A]/10 text-[#C47B4A]' : 'bg-[#2C3E50]/5 text-[#2C3E50]'}`}>
            {propiedad.tipoTransaccion}
          </span>
        </div>

        {propiedad.asesor && (
          <p className="text-xs text-[#2C3E50]/60 mt-2">
            Asesor: {propiedad.asesor.nombre}
          </p>
        )}

        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
          <Link to={`/propiedad/${propiedad.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
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