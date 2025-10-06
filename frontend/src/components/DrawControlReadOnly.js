import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw/dist/leaflet.draw.css";

const DrawControlReadOnly = ({ drawnPolygon, showBorder = true }) => {
  const map = useMap();

  useEffect(() => {
    if (!drawnPolygon || drawnPolygon.length === 0) return;

    const polygonLayer = L.polygon(
      drawnPolygon.map((coord) => [coord[1], coord[0]]),
      {
        color: showBorder ? "#3b82f6" : "transparent",
        weight: showBorder ? 2 : 0,
        fillOpacity: 0,
        interactive: false,
      }
    );

    polygonLayer.addTo(map);

    return () => {
      map.removeLayer(polygonLayer);
    };
  }, [map, drawnPolygon, showBorder]);

  return null;
};

export default DrawControlReadOnly;
