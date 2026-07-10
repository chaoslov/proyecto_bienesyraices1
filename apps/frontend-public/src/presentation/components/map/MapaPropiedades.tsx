import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { PropiedadApi } from '@/infrastructure/api/repositories/PropiedadApiRepository'
import type { Propiedad } from '@/domain/entities/Propiedad'
import { crearIconoMarcador } from './IconosMarcador'
import { PopupPropiedad } from './PopupPropiedad'

const MapSync = ({ selectedId, propiedades, markersRef }: { selectedId?: string | null; propiedades: Propiedad[]; markersRef: Record<string, any> }) => {
  const map = useMap()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!selectedId) return
    if (last.current === selectedId) return
    last.current = selectedId
    const prop = propiedades.find((p) => p.id === selectedId)
    if (!prop) return
    const marker = markersRef?.[selectedId]
    const latlng: any = [prop.ubicacion.latitud, prop.ubicacion.longitud]
    try {
      map.setView(latlng, Math.max(map.getZoom(), 13), { animate: true })
      if (marker && marker.openPopup) {
        const instance = marker?.current ?? marker
        instance?.openPopup()
      } else {
        const L = require('leaflet')
        const popup = L.popup({ maxWidth: 300 }).setLatLng(latlng).setContent(prop.titulo)
        popup.openOn(map)
      }
    } catch (err) {
    }
  }, [selectedId, propiedades, markersRef, map])

  return null
}

const MapaControles = () => {
  const map = useMap()
  useEffect(() => {
    map.zoomControl.setPosition('topright')
  }, [map])
  return null
}

export const MapaPropiedades = ({ altura = '500px', selectedId }: { altura?: string; selectedId?: string | null }) => {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const markersRef = useRef<Record<string, any>>({})

  useEffect(() => {
    PropiedadApi.listar({}, 1, 50).then((res) => {
      const conCoords = res.data.filter(
        (p) => p.ubicacion?.latitud && p.ubicacion?.longitud,
      )
      setPropiedades(conCoords)
    }).catch((err) => {
      setError(err?.message || 'Error al cargar propiedades')
    }).finally(() => setCargando(false))
  }, [])

  return (
    <div style={{ position: 'relative', height: altura, width: '100%' }}>
      {cargando && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
          backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '13px', color: '#475569',
        }}>
          <span className="animate-spin h-4 w-4 border-2 border-[#2C3E50] border-t-transparent rounded-full inline-block" />
          Cargando propiedades...
        </div>
      )}

      {error && (
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
          backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '8px 16px', borderRadius: '8px',
          fontSize: '13px', color: '#DC2626',
        }}>
          {error}
        </div>
      )}

      <MapContainer
          center={[-2.203, -79.897]}
          zoom={12}
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
          scrollWheelZoom={true}
        >
          <MapaControles />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {propiedades.map((prop) => (
            <Marker
              key={prop.id}
              ref={(r) => { if (r) markersRef.current[prop.id] = r }}
              position={[prop.ubicacion.latitud, prop.ubicacion.longitud]}
              icon={crearIconoMarcador(prop.tipoTransaccion)}
              title={prop.titulo}
            >
              <Popup maxWidth={250} minWidth={200}>
                <PopupPropiedad propiedad={prop} />
              </Popup>
            </Marker>
        ))}
          <MapSync selectedId={selectedId} propiedades={propiedades} markersRef={markersRef.current} />
      </MapContainer>

      {!cargando && !error && propiedades.length > 0 && (
        <div style={{
          marginTop: '8px', display: 'flex', gap: '16px', fontSize: '12px',
          color: '#64748B', justifyContent: 'flex-end',
        }}>
          <span>
            <span style={{
              display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: '#2C3E50', marginRight: '4px',
            }} />
            Venta
          </span>
          <span>
            <span style={{
              display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: '#C47B4A', marginRight: '4px',
            }} />
            Alquiler
          </span>
          <span style={{ marginLeft: 'auto', fontStyle: 'italic' }}>
            {propiedades.length} propiedades en el mapa
          </span>
        </div>
      )}
    </div>
  )
}