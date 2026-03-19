import { APIProvider, Map } from '@vis.gl/react-google-maps'

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
        />
      </APIProvider>
    </div>
  )
}
