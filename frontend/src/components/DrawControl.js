import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

const DrawControl = ({ onPolygonCreated, onPolygonDeleted, drawnPolygon }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const shapeOptions = {
      color: "#3b82f6",
      weight: 2,
      fillOpacity: 0,
    };

    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          allowIntersection: false,
          shapeOptions,
        },
        polyline: false,
        rectangle: { shapeOptions },
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);

    const disableDrawing = () => {
      const toolbar = document.querySelector(".leaflet-draw-draw-polygon");
      const rectangleBtn = document.querySelector(
        ".leaflet-draw-draw-rectangle"
      );
      if (toolbar) {
        toolbar.classList.add("leaflet-disabled");
        toolbar.style.pointerEvents = "none";
        toolbar.style.opacity = "0.4";
      }
      if (rectangleBtn) {
        rectangleBtn.classList.add("leaflet-disabled");
        rectangleBtn.style.pointerEvents = "none";
        rectangleBtn.style.opacity = "0.4";
      }
    };

    const enableDrawing = () => {
      const toolbar = document.querySelector(".leaflet-draw-draw-polygon");
      const rectangleBtn = document.querySelector(
        ".leaflet-draw-draw-rectangle"
      );
      if (toolbar) {
        toolbar.classList.remove("leaflet-disabled");
        toolbar.style.pointerEvents = "";
        toolbar.style.opacity = "";
      }
      if (rectangleBtn) {
        rectangleBtn.classList.remove("leaflet-disabled");
        rectangleBtn.style.pointerEvents = "";
        rectangleBtn.style.opacity = "";
      }
    };

    if (drawnPolygon && drawnPolygon.length > 0) {
      const existingPolygon = L.polygon(
        drawnPolygon.map((coord) => [coord[1], coord[0]]),
        shapeOptions
      );
      drawnItems.addLayer(existingPolygon);
      disableDrawing();
    }

    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers();
      const layer = e.layer;
      layer.setStyle({ fillOpacity: 0 });
      drawnItems.addLayer(layer);

      const coordinates = layer
        .getLatLngs()[0]
        .map((latlng) => [latlng.lng, latlng.lat]);
      onPolygonCreated(coordinates);
      disableDrawing();
    });

    map.on(L.Draw.Event.DELETED, (e) => {
      e.layers.eachLayer((layer) => drawnItems.removeLayer(layer));

      if (drawnItems.getLayers().length === 0) {
        onPolygonDeleted();
        enableDrawing();
      }
    });

    map.on(L.Draw.Event.EDITED, (e) => {
      e.layers.eachLayer((layer) => {
        const coordinates = layer
          .getLatLngs()[0]
          .map((latlng) => [latlng.lng, latlng.lat]);
        onPolygonCreated(coordinates);
      });
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onPolygonCreated, onPolygonDeleted, drawnPolygon]);

  return null;
};

export default DrawControl;
