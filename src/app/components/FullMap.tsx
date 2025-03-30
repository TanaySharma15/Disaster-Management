"use client";

import { useEffect } from "react";
import useSWR from "swr";
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
  coordinates: [number, number, number]; // [longitude, latitude, depth]
  magnitude: number;
  place: string;
  time: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FullPageMap() {
  // Fetch earthquake data from backend
  const { data, error } = useSWR("/api/disaster", fetcher, {
    refreshInterval: 300000, // refresh every 5 minutes
  });

  // Use default empty array if data is not yet available
  const earthquakeData: Earthquake[] = data?.earthquake || [];

  // Transform earthquake data into markers
  const markers = earthquakeData.map((eq) => ({
    id: eq.id,
    // Leaflet expects [lat, lon] as a tuple
    position: [eq.coordinates[1], eq.coordinates[0]] as [number, number],
    title: `${eq.place} (M ${eq.magnitude})`,
  }));

  // Calculate center based on markers; default to [0, 0] if no data
  const center: [number, number] =
    markers.length > 0
      ? [
          markers.reduce((acc, m) => acc + m.position[0], 0) / markers.length,
          markers.reduce((acc, m) => acc + m.position[1], 0) / markers.length,
        ]
      : [0, 0];

  if (error) return <div>Error loading map data</div>;
  if (!data) return <div>Loading map data...</div>;

  return (
    <MapContainer
      center={center}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker) => (
        <Marker key={marker.id} position={marker.position}>
          <Popup>
            <div>
              <strong>{marker.title}</strong>
              <br />
              Time:{" "}
              {new Date(
                earthquakeData.find((eq) => eq.id === marker.id)?.time ||
                  Date.now()
              ).toLocaleString()}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
