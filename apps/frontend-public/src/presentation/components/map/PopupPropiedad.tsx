import { Link } from 'react-router-dom'
import type { Propiedad } from '@/domain/entities/Propiedad'

const formatearPrecio = (precio: number, tipo: string): string => {
  const f = new Intl.NumberFormat('es-EC', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(precio)
  return tipo === 'alquiler' ? `${f}/mes` : f
}

export const PopupPropiedad = ({ propiedad }: { propiedad: Propiedad }) => {
  return (
    <div className="popup-propiedad" style={{ minWidth: '200px', maxWidth: '240px' }}>
      {propiedad.imagenes?.[0] && (
        <img
          src={propiedad.imagenes[0]}
          alt={propiedad.titulo}
          style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
        />
      )}

      <span style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700,
        textTransform: 'uppercase', marginBottom: '6px',
        backgroundColor: propiedad.tipoTransaccion === 'venta' ? '#D5D8DC' : '#F5E6D3',
        color: propiedad.tipoTransaccion === 'venta' ? '#2C3E50' : '#C47B4A',
      }}>
        {propiedad.tipoTransaccion === 'venta' ? 'En Venta' : 'En Alquiler'}
      </span>

      <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: '#1E293B', lineHeight: 1.3 }}>
        {propiedad.titulo}
      </h3>

      <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#64748B' }}>
         {propiedad.ubicacion?.direccion || propiedad.ubicacion?.ciudad || 'Guayaquil'}
      </p>

      <p style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 700, color: '#2C3E50' }}>
        {formatearPrecio(propiedad.precio, propiedad.tipoTransaccion)}
      </p>

      <Link
        to={`/propiedad/${propiedad.id}`}
        style={{
          display: 'block', textAlign: 'center', padding: '8px', backgroundColor: '#2C3E50',
          color: 'white', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: 600,
        }}
      >
        Ver detalle →
      </Link>
    </div>
  )
}
