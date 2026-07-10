import { useNavigate } from 'react-router-dom'
import { Propiedad } from '@/domain/entities/Propiedad'

interface Props {
  propiedad: Propiedad
}

export const ChatTarjetaPropiedad = ({ propiedad }: Props) => {
  const navigate = useNavigate()
  const imagenPrincipal = propiedad.imagenes && propiedad.imagenes.length > 0 
    ? propiedad.imagenes[0] 
    : 'https://via.placeholder.com/400x300?text=Sin+Imagen'

  return (
    <div className="w-[250px] flex-shrink-0 bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden flex flex-col snap-start">
      <div className="h-36 w-full bg-slate-100 relative">
        <img 
          src={imagenPrincipal} 
          alt={propiedad.titulo}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-[#2C3E50] text-white text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
          {propiedad.tipoTransaccion}
        </span>
        {propiedad.destacada && (
          <span className="absolute top-2 right-2 bg-[#D35400] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
            Destacada
          </span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{propiedad.tipoInmueble}</p>
          <h4 className="text-sm font-bold text-slate-850 line-clamp-1 mt-0.5" title={propiedad.titulo}>
            {propiedad.titulo}
          </h4>
          <p className="text-xs text-gray-450 mt-0.5">{propiedad.ubicacion.ciudad}, Ecuador</p>
          <p className="text-base font-extrabold text-[#2C3E50] mt-1.5">
            ${propiedad.precio.toLocaleString('es-EC')}
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3 pt-2.5 border-t border-gray-100">
          <span className="flex items-center gap-0.5">🛏️ {propiedad.habitaciones} hab.</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">🚿 {propiedad.banos} {propiedad.banos === 1 ? 'baño' : 'baños'}</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">📐 {propiedad.areaTotal} m²</span>
        </div>
        <button 
          onClick={() => navigate(`/propiedad/${propiedad.id}`)}
          className="w-full mt-3 py-1.5 bg-[#2C3E50] hover:bg-[#1a2a3a] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
        >
          Ver Detalle
        </button>
      </div>
    </div>
  )
}