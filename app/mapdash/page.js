"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getSOSRequests } from "@/services/sosRequestService";
import { useLeafletDynamicImport } from "@/hooks/useLeafletDynamicImport";
// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function Mapdash() {
  useLeafletDynamicImport();
  const position = [23.685, 90.3563]; // Default center position
  const [sosLocations, setSosLocations] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure the code runs only on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchSOSData() {
      try {
        const result = await getSOSRequests();
        if (result && result.data) {
          setSosLocations(result.data); // Assuming response is an array of SOS data
        } else {
          console.error("Failed to fetch SOS requests:", result.message);
        }
      } catch (error) {
        console.error("Error fetching SOS requests:", error);
      }
    }

    fetchSOSData();
  }, []);

  if (!isClient) {
    // Render nothing on the server side
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={9}
      scrollWheelZoom={true}
      className="h-120 w-full z-0 "
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sosLocations.map((sos, index) => (
        <Marker key={index} position={[sos.location.lat, sos.location.long]}>
          <Popup>
            <div>
              <p>
                <strong>User:</strong> {sos.user}
              </p>
              <p>
                <strong>Date:</strong> {new Date(sos.date).toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
