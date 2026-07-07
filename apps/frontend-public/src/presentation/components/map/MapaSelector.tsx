import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

interface Props {
  latitud: number
  longitud: number
  onChange: (lat: number, lng: number) => void
  altura?: string
}

const MarcadorClickeable = ({ latitud, longitud, onChange }: { latitud: number; longitud: number; onChange: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onChange(e.latlng.lat, e.latlng.lng)
    },
  })
  return latitud !== 0 && longitud !== 0 ? <Marker position={[latitud, longitud]} /> : null
}

const ControlVista = ({ latitud, longitud }: { latitud: number; longitud: number }) => {
  const map = useMap()
  useEffect(() => {
    if (latitud !== 0 && longitud !== 0) {
      map.setView([latitud, longitud], map.getZoom())
    }
  }, [latitud, longitud])
  return null
}

export const MapaSelector = ({ latitud, longitud, onChange, altura = '400px' }: Props) => {
  return (
    <div style={{ height: altura, width: '100%', borderRadius: '12px', overflow: 'hidden', isolation: 'isolate', position: 'relative', zIndex: 1 }}>
      <MapContainer
        center={latitud !== 0 && longitud !== 0 ? [latitud, longitud] : [-2.203, -79.897]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarcadorClickeable latitud={latitud} longitud={longitud} onChange={onChange} />
        <ControlVista latitud={latitud} longitud={longitud} />
      </MapContainer>
    </div>
  )
}