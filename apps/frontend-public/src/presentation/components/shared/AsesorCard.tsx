import { Link } from 'react-router-dom'
import { Asesor } from '@/domain/entities/Asesor'

interface AsesorCardProps {
  asesor: Asesor
}

export const AsesorCard = ({ asesor }: AsesorCardProps) => {
  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative overflow-hidden bg-gray-200 aspect-video">
        <img
          src={asesor.fotografia}
          alt={`${asesor.nombre} ${asesor.apellido}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800">
          {asesor.nombre} {asesor.apellido}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5">
          Agente · {asesor.especialidad || 'Alpha Inmobiliaria'}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-gray-800">{asesor.experiencia}</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">AÑOS</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">0</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">PROPIEDADES</p>
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800">★</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">RATING</p>
          </div>
        </div>

        <div className="mt-4">
          <Link to={`/asesores/${asesor.id}`}>
            <button className="w-full py-2.5 px-4 bg-[#2C3E50] text-white font-medium rounded-lg hover:bg-[#1A252F] transition-colors duration-300 text-sm">
              Ver Perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}