import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export const DEFAULT_COMPLAINT_MAP_CENTER = [-2.9909, 104.7566];

const selectedLocationIcon = L.divIcon({
  className: "complaint-location-marker",
  html: '<div style="width:22px;height:22px;border:3px solid white;border-radius:50%;background:#2563eb;box-shadow:0 1px 6px #0008"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const MapClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(event) {
      onSelect({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    },
  });
  return null;
};

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], Math.max(map.getZoom(), 15), {
        duration: 0.5,
      });
    }
  }, [map, position?.latitude, position?.longitude]);

  return null;
};

const LocationPicker = ({ value, onChange }) => (
  <MapContainer
    center={value ? [value.latitude, value.longitude] : DEFAULT_COMPLAINT_MAP_CENTER}
    zoom={value ? 15 : 12}
    scrollWheelZoom={false}
    className="z-0 h-[320px] w-full rounded-lg sm:h-[400px]"
  >
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    <MapClickHandler onSelect={onChange} />
    <RecenterMap position={value} />
    {value && (
      <Marker
        position={[value.latitude, value.longitude]}
        icon={selectedLocationIcon}
        draggable
        eventHandlers={{
          dragend: (event) => {
            const point = event.target.getLatLng();
            onChange({ latitude: point.lat, longitude: point.lng });
          },
        }}
      >
        <Popup>Titik lokasi pengaduan</Popup>
      </Marker>
    )}
  </MapContainer>
);

export default LocationPicker;
