import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps'

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'all',
    elementType: 'all',
    stylers: [
      { invert_lightness: true },
      { saturation: 10 },
      { lightness: 30 },
      { gamma: 0.5 },
      { hue: '#435158' },
    ],
  },
]

const MARKERS = [
  { lat: 37.4979, lng: 127.0276 },
  { lat: 37.5447, lng: 127.056 },
  { lat: 37.5013, lng: 127.0396 },
]

export default function PropertyMap() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10" style={{ height: 500 }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={{ lat: 36.8, lng: 127.8 }}
          defaultZoom={7}
          styles={MAP_STYLES}
          disableDefaultUI
          gestureHandling="cooperative"
          style={{ width: '100%', height: '100%' }}
        >
          {MARKERS.map((pos, i) => (
            <Marker
              key={i}
              position={pos}
              icon={{
                url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36"><path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 24 12 24s12-15 12-24C24 5.373 18.627 0 12 0z" fill="white"/><circle cx="12" cy="12" r="4" fill="%23888"/></svg>',
                scaledSize: { width: 24, height: 36 } as google.maps.Size,
              }}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  )
}
