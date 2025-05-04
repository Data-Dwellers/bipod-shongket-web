import { useEffect } from "react";

export function useLeafletDynamicImport() {
  useEffect(() => {
    const loadLeafletCSS = async () => {
      if (typeof window !== "undefined") {
        await import("leaflet/dist/leaflet.css");
        await import("leaflet-defaulticon-compatibility");
        await import(
          "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
        );
      }
    };

    loadLeafletCSS();
  }, []);
}
