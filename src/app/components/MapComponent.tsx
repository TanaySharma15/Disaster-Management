"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon paths for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

interface Earthquake {
  id: string;
  coordinates: [number, number, number]; // [lon, lat, depth]
  magnitude: number;
  place: string;
  time: number;
}

interface MapComponentProps {
  earthquakes: Earthquake[];
}

export default function MapComponent({ earthquakes }: MapComponentProps) {
  const center: [number, number] =
    earthquakes.length > 0
      ? [
          earthquakes.reduce((acc, eq) => acc + eq.coordinates[1], 0) /
            earthquakes.length,
          earthquakes.reduce((acc, eq) => acc + eq.coordinates[0], 0) /
            earthquakes.length,
        ]
      : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {earthquakes.map((eq) => (
        <Marker key={eq.id} position={[eq.coordinates[1], eq.coordinates[0]]}>
          <Popup>
            <div>
              <h3 className="font-bold">{eq.place}</h3>
              <p>Magnitude: {eq.magnitude}</p>
              <p>Time: {new Date(eq.time).toLocaleString()}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
