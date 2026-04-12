"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Building, MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet with webpack/nextjs
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// A component to recenter map when schools change
function MapUpdater({ schools }) {
  const map = useMap();
  useEffect(() => {
    if (schools.length > 0) {
      const bounds = L.latLngBounds(
        schools
          .filter(s => (s.lat || s.location?.lat) && (s.lng || s.location?.lng))
          .map(s => [Number(s.lat || s.location?.lat), Number(s.lng || s.location?.lng)])
      );
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [schools, map]);
  return null;
}

export default function SchoolMapInner({ schools, onEdit, onDelete, onSelect }) {
  // Center of Sri Lanka roughly
  const center = [7.8731, 80.7718];

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer
        center={center}
        zoom={7}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater schools={schools} />

        {schools.map((school) => {
          const lat = Number(school.lat || school.location?.lat);
          const lng = Number(school.lng || school.location?.lng);

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker key={school.id || school._id} position={[lat, lng]} icon={icon}>
              <Popup className="rounded-xl overflow-hidden">
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{school.name}</h3>
                  <p className="text-slate-600 text-sm mb-3">{school.city}, {school.district}</p>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => onEdit(school)}
                      className="flex-1 bg-cyan-50 text-cyan-700 font-semibold py-1.5 rounded-lg hover:bg-cyan-100 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(school.id || school._id || "")}
                      className="flex-1 bg-red-50 text-red-600 font-semibold py-1.5 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
