import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import React, { useState, useEffect, useRef } from "react";
import DrawControlReadOnly from "./DrawControlReadOnly";
import ParkMarkers from "./ParkMarkers";
import { Settings, X, Maximize2, Info, MapPin } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const useLegendsData = () => {
  const { t } = useTranslation();

  return {
    ndvi: {
      title: t("legends.ndvi.title"),
      description: t("legends.ndvi.description"),
      items: [
        {
          color: "bg-[#228B22]",
          label: t("legends.ndvi.highDensity"),
          value: "> 0.6",
        },
        {
          color: "bg-[#90EE90]",
          label: t("legends.ndvi.medium"),
          value: "0.3 - 0.6",
        },
        { color: "bg-[#F5F5DC]", label: t("legends.ndvi.low"), value: "< 0.3" },
      ],
    },
    lst: {
      title: t("legends.lst.title"),
      description: t("legends.lst.description"),
      items: [
        {
          color: "bg-red-600",
          label: t("legends.lst.critical"),
          value: "> 40°C",
        },
        {
          color: "bg-yellow-500",
          label: t("legends.lst.high"),
          value: "35-40°C",
        },
        {
          color: "bg-blue-400",
          label: t("legends.lst.normal"),
          value: "< 35°C",
        },
      ],
    },
    lights: {
      title: t("legends.lights.title"),
      description: t("legends.lights.description"),
      items: [
        {
          color: "bg-white",
          label: t("legends.lights.highActivity"),
          value: "",
        },
        {
          color: "bg-yellow-400",
          label: t("legends.lights.medium"),
          value: "",
        },
        { color: "bg-purple-600", label: t("legends.lights.low"), value: "" },
      ],
    },
    population: {
      title: t("legends.population.title"),
      description: t("legends.population.description"),
      items: [
        {
          color: "bg-red-800",
          label: t("legends.population.veryHigh"),
          value: "> 150 hab/ha",
        },
        {
          color: "bg-orange-500",
          label: t("legends.population.high"),
          value: "100-150 hab/ha",
        },
        {
          color: "bg-yellow-300",
          label: t("legends.population.medium"),
          value: "< 100 hab/ha",
        },
      ],
    },
    priority: {
      title: t("legends.priority.title"),
      description: t("legends.priority.description"),
      items: [
        {
          color: "bg-red-800",
          label: t("legends.priority.critical"),
          value: "Score > 6",
        },
        {
          color: "bg-orange-500",
          label: t("legends.priority.high"),
          value: "Score 4-6",
        },
        {
          color: "bg-yellow-400",
          label: t("legends.priority.moderate"),
          value: "Score < 4",
        },
      ],
    },
  };
};

const MapLegend = ({ layerId }) => {
  const legendsData = useLegendsData();
  const legend = legendsData[layerId];
  if (!legend) return null;

  return (
    <div className="bg-black/90 backdrop-blur-xl rounded-lg p-4 border border-white/20 shadow-2xl max-w-xs">
      <div className="flex items-start gap-2 mb-3">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-white font-semibold text-sm mb-1">
            {legend.title}
          </h4>
          <p className="text-white/70 text-xs leading-relaxed">
            {legend.description}
          </p>
        </div>
      </div>
      <div className="space-y-2 mt-3">
        {legend.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded ${item.color} flex-shrink-0 border border-white/20`}
            ></div>
            <div className="flex-1 min-w-0">
              <span className="text-white text-sm font-medium">
                {item.label}
              </span>
              {item.value && (
                <span className="text-white/60 text-xs ml-2">
                  ({item.value})
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AreaInfoTooltip = ({ drawnPolygon }) => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);

  if (!drawnPolygon || drawnPolygon.length === 0) return null;

  const calculateArea = () => {
    const R = 6371;
    let area = 0;
    const coords = drawnPolygon.map((coord) => [coord[1], coord[0]]);

    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      const lat1 = (coords[i][0] * Math.PI) / 180;
      const lat2 = (coords[j][0] * Math.PI) / 180;
      const lng1 = (coords[i][1] * Math.PI) / 180;
      const lng2 = (coords[j][1] * Math.PI) / 180;
      area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs((area * R * R) / 2);
    return area.toFixed(2);
  };

  const getCenterPoint = () => {
    const lats = drawnPolygon.map((c) => c[1]);
    const lngs = drawnPolygon.map((c) => c[0]);
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
    return { lat: centerLat.toFixed(6), lng: centerLng.toFixed(6) };
  };

  const area = calculateArea();
  const center = getCenterPoint();

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button className="bg-blue-600/90 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-semibold shadow-lg transition-colors flex items-center gap-2">
        <MapPin className="w-4 h-4" />
        {t("areaInfo.buttonLabel")}
      </button>

      {showTooltip && (
        <div className="absolute top-full mt-2 left-0 bg-black/95 backdrop-blur-xl rounded-lg p-4 shadow-2xl border border-white/20 min-w-[300px] z-[10001]">
          <div className="space-y-3">
            <div className="border-b border-white/10 pb-2">
              <p className="text-blue-400 text-xs font-semibold mb-1 uppercase tracking-wide">
                {t("areaInfo.selectedArea")}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-xs mb-1">
                {t("areaInfo.totalArea")}
              </p>
              <p className="text-white font-bold text-lg">{area} km²</p>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-white/60 text-xs mb-2">
                {t("areaInfo.geoCenter")}
              </p>
              <div className="bg-white/5 rounded p-2 space-y-1">
                <p className="text-white text-xs font-mono flex items-center gap-2">
                  <span className="text-white/60">Lat:</span>
                  <span className="text-blue-400">{center.lat}</span>
                </p>
                <p className="text-white text-xs font-mono flex items-center gap-2">
                  <span className="text-white/60">Lng:</span>
                  <span className="text-blue-400">{center.lng}</span>
                </p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-white/60 text-xs mb-1">
                {t("areaInfo.geometry")}
              </p>
              <p className="text-white font-semibold text-sm">
                {drawnPolygon.length} {t("areaInfo.vertices")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MaximizedMapModal = ({
  layer,
  syncCenter,
  syncZoom,
  drawnPolygon,
  onClose,
  parkRecommendations,
}) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-8">
      <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden border-2 border-white/20">
        <div className="absolute top-4 left-20 right-4 z-[10000] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-white text-2xl font-bold bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
              {layer.title}
            </h3>
            <AreaInfoTooltip drawnPolygon={drawnPolygon} />
          </div>
          <button
            onClick={onClose}
            className="bg-red-600/90 hover:bg-red-700 text-white p-3 rounded-lg transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {layer.id !== "reference" && (
          <div className="absolute bottom-6 right-6 z-[10000]">
            <MapLegend layerId={layer.id} />
          </div>
        )}

        <MapContainer
          center={syncCenter}
          zoom={syncZoom}
          scrollWheelZoom={true}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {layer.url && (
            <TileLayer
              url={layer.url}
              attribution="Google Earth Engine"
              opacity={layer.opacity / 100}
            />
          )}
          {drawnPolygon && (
            <DrawControlReadOnly
              drawnPolygon={drawnPolygon}
              showBorder={layer.id === "reference"}
            />
          )}
          {layer.id === "reference" && (
            <ParkMarkers
              parkRecommendations={parkRecommendations}
              showPopup={true}
              showTooltip={true}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

const MiniMap = ({
  title,
  tileUrl,
  center,
  zoom,
  onMapSync,
  mapId,
  opacity,
  onOpacityChange,
  drawnPolygon,
  onMaximize,
  parkRecommendations,
}) => {
  const mapInstanceRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const originMapRef = useRef(null);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation();

  function MapSync() {
    const map = useMapEvents({
      movestart: () => {
        if (!isUpdatingRef.current) {
          originMapRef.current = mapId;
        }
      },
      moveend: () => {
        if (originMapRef.current === mapId && !isUpdatingRef.current) {
          const newCenter = map.getCenter();
          const newZoom = map.getZoom();
          onMapSync(newCenter, newZoom, mapId);
          originMapRef.current = null;
        }
      },
      zoomend: () => {
        if (originMapRef.current === mapId && !isUpdatingRef.current) {
          const newCenter = map.getCenter();
          const newZoom = map.getZoom();
          onMapSync(newCenter, newZoom, mapId);
        }
      },
    });

    useEffect(() => {
      mapInstanceRef.current = map;
    }, [map]);

    useEffect(() => {
      if (originMapRef.current !== mapId && mapInstanceRef.current) {
        isUpdatingRef.current = true;
        mapInstanceRef.current.setView(center, zoom, { animate: false });
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    }, [center, zoom]);

    return null;
  }

  return (
    <div
      className={`relative h-full w-full border-2 rounded-lg overflow-hidden ${
        mapId === "reference" ? "border-white/20" : "border-transparent"
      }`}
    >
      <div className="absolute top-2 left-2 right-2 z-[1000] flex items-center justify-between">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-black/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-lg hover:bg-black/90 transition-colors flex items-center gap-2"
        >
          {title}
          {tileUrl && <Settings className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onMaximize}
          className="bg-black/80 backdrop-blur-sm text-white p-1.5 rounded-md shadow-lg hover:bg-black/90 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {showSettings && tileUrl && (
        <div className="absolute top-12 left-2 right-2 z-[1001] bg-black/95 backdrop-blur-xl rounded-lg p-4 shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold text-sm">
              {t("map.settings")}
            </h4>
            <button
              onClick={() => setShowSettings(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="text-white/80 text-xs mb-2 block">
              {t("map.layerOpacity")}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => onOpacityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right text-white/60 text-xs mt-1">
              {opacity}%
            </div>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tileUrl && (
          <TileLayer
            url={tileUrl}
            attribution="Google Earth Engine"
            opacity={opacity / 100}
          />
        )}
        <MapSync />
        {drawnPolygon && (
          <DrawControlReadOnly
            drawnPolygon={drawnPolygon}
            showBorder={mapId === "reference"}
          />
        )}
        {mapId === "reference" && (
          <ParkMarkers
            parkRecommendations={parkRecommendations}
            showPopup={false}
            showTooltip={false}
          />
        )}
      </MapContainer>
    </div>
  );
};

function GridMapView({
  ndviTileUrl,
  lstTileUrl,
  nighttimeLightsTileUrl,
  populationTileUrl,
  priorityZonesTileUrl,
  ndviOpacity,
  lstOpacity,
  nighttimeLightsOpacity,
  populationOpacity,
  priorityZonesOpacity,
  setNdviOpacity,
  setLstOpacity,
  setNighttimeLightsOpacity,
  setPopulationOpacity,
  setPriorityZonesOpacity,
  center,
  isLoading,
  drawnPolygon,
  parkRecommendations,
}) {
  const [syncCenter, setSyncCenter] = useState(center);
  const [syncZoom, setSyncZoom] = useState(13);
  const lastSourceRef = useRef(null);
  const [maximizedLayer, setMaximizedLayer] = useState(null);
  const { t } = useTranslation();

  const handleMapSync = (newCenter, newZoom, sourceId) => {
    if (lastSourceRef.current === sourceId) return;
    lastSourceRef.current = sourceId;
    setSyncCenter([newCenter.lat, newCenter.lng]);
    setSyncZoom(newZoom);
    setTimeout(() => {
      lastSourceRef.current = null;
    }, 150);
  };

  useEffect(() => {
    if (drawnPolygon) {
      const polygonCenter = [
        drawnPolygon.reduce((sum, coord) => sum + coord[1], 0) /
          drawnPolygon.length,
        drawnPolygon.reduce((sum, coord) => sum + coord[0], 0) /
          drawnPolygon.length,
      ];
      setSyncCenter(polygonCenter);
    }
  }, [drawnPolygon]);

  const allLayersConfig = [
    {
      title: t("map.referenceMap"),
      url: null,
      id: "reference",
      opacity: 100,
      onOpacityChange: () => {},
    },
    {
      title: t("map.vegetationIndex"),
      url: ndviTileUrl,
      id: "ndvi",
      opacity: ndviOpacity,
      onOpacityChange: setNdviOpacity,
    },
    {
      title: t("map.heatIslands"),
      url: lstTileUrl,
      id: "lst",
      opacity: lstOpacity,
      onOpacityChange: setLstOpacity,
    },
    {
      title: t("map.nightLights"),
      url: nighttimeLightsTileUrl,
      id: "lights",
      opacity: nighttimeLightsOpacity,
      onOpacityChange: setNighttimeLightsOpacity,
    },
    {
      title: t("map.populationDensity"),
      url: populationTileUrl,
      id: "population",
      opacity: populationOpacity,
      onOpacityChange: setPopulationOpacity,
    },
    {
      title: t("map.priorityZones"),
      url: priorityZonesTileUrl,
      id: "priority",
      opacity: priorityZonesOpacity,
      onOpacityChange: setPriorityZonesOpacity,
    },
  ];

  const activeLayers = allLayersConfig.filter(
    (layer) => layer.id === "reference" || layer.url
  );

  if (activeLayers.length === 0) {
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="text-center text-white/70">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold mb-2">{t("map.loadingCap")}</p>
          <p className="text-sm">{t("map.loadingDesc")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full grid grid-cols-3 grid-rows-2 gap-4">
        {activeLayers.map((layer) => (
          <MiniMap
            key={layer.id}
            mapId={layer.id}
            title={layer.title}
            tileUrl={layer.url}
            opacity={layer.opacity}
            onOpacityChange={layer.onOpacityChange}
            center={syncCenter}
            zoom={syncZoom}
            onMapSync={handleMapSync}
            drawnPolygon={drawnPolygon}
            onMaximize={() => setMaximizedLayer(layer)}
            parkRecommendations={parkRecommendations}
          />
        ))}
      </div>

      {maximizedLayer && (
        <MaximizedMapModal
          layer={maximizedLayer}
          syncCenter={syncCenter}
          syncZoom={syncZoom}
          drawnPolygon={drawnPolygon}
          onClose={() => setMaximizedLayer(null)}
          parkRecommendations={parkRecommendations}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[2000]">
          <div className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{t("map.loadingCap")}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GridMapView;
