import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import React, { useEffect } from "react";
import DrawControl from "./DrawControl";
import ParkMarkers from "./ParkMarkers";

function MapUpdater({ center }) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    const distance = Math.sqrt(
      Math.pow(currentCenter.lat - center[0], 2) +
        Math.pow(currentCenter.lng - center[1], 2)
    );

    if (distance > 0.01) {
      map.setView(center, 11);
    }
  }, [center, map]);

  return null;
}

function RealMap({
  center,
  onPolygonCreated,
  onPolygonDeleted,
  drawnPolygon,
  parkRecommendations,
}) {
  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} />
        <DrawControl
          onPolygonCreated={onPolygonCreated}
          onPolygonDeleted={onPolygonDeleted}
          drawnPolygon={drawnPolygon}
        />
        <ParkMarkers parkRecommendations={parkRecommendations} />
      </MapContainer>
    </div>
  );
}

export default RealMap;
