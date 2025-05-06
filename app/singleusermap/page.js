"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
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

function MapComponent() {
  const searchParams = useSearchParams();
  const lat = parseFloat(searchParams.get("lat"));
  const long = parseFloat(searchParams.get("long"));
  useLeafletDynamicImport();

  if (!lat || !long) {
    return <div>No location data provided</div>;
  }

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={[lat, long]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, long]} />
      </MapContainer>
    </div>
  );
}

export default function Mapdash() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapComponent />
    </Suspense>
  );
}
