import { useEffect, useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MapContainerWrapper from "./components/MapContainerWrapper";
import { DEFAULT_YEAR, DEFAULT_MONTH } from "./config/constants";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [ndviTileUrl, setNdviTileUrl] = useState(null);
  const [lstTileUrl, setLstTileUrl] = useState(null);
  const [nighttimeLightsTileUrl, setNighttimeLightsTileUrl] = useState(null);
  const [populationTileUrl, setPopulationTileUrl] = useState(null);
  const [priorityZonesTileUrl, setPriorityZonesTileUrl] = useState(null);
  const [priorityAnalysis, setPriorityAnalysis] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: -12.004233,
    lng: -77.10272,
  });
  const [ndviOpacity, setNdviOpacity] = useState(90);
  const [lstOpacity, setLstOpacity] = useState(90);
  const [nighttimeLightsOpacity, setNighttimeLightsOpacity] = useState(90);
  const [populationOpacity, setPopulationOpacity] = useState(90);
  const [priorityZonesOpacity, setPriorityZonesOpacity] = useState(90);
  const [drawnPolygon, setDrawnPolygon] = useState(null);
  const [loadingLayers, setLoadingLayers] = useState(0);
  const [parkRecommendations, setParkRecommendations] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [layerOrder] = useState([
    "ndvi",
    "lst",
    "nighttimeLights",
    "population",
    "priorityZones",
  ]);

  const handleCitySelect = useCallback((city) => {
    setMapCenter({ lat: city.lat, lng: city.lng });
  }, []);

  const handlePolygonCreated = useCallback((coordinates) => {
    setDrawnPolygon(coordinates);
  }, []);

  const handlePolygonDeleted = useCallback(() => {
    setDrawnPolygon(null);
    setNdviTileUrl(null);
    setLstTileUrl(null);
    setNighttimeLightsTileUrl(null);
    setPopulationTileUrl(null);
    setPriorityZonesTileUrl(null);
    setPriorityAnalysis(null);
    setParkRecommendations(null);
  }, []);

  const fetchLayerWithPolygon = useCallback(
    async (type, setTileUrl) => {
      if (!drawnPolygon) return;

      setLoadingLayers((prev) => prev + 1);
      try {
        const url = `${API_URL}/${type}-polygon`;
        const body = { coordinates: drawnPolygon };

        if (type === "nighttime-lights") {
          body.year = DEFAULT_YEAR;
          body.month = DEFAULT_MONTH;
        } else if (type !== "population-density") {
          body.year = DEFAULT_YEAR;
        }

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await response.json();
        setTileUrl(data.tileUrl);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        setTileUrl(null);
      } finally {
        setLoadingLayers((prev) => prev - 1);
      }
    },
    [drawnPolygon]
  );

  useEffect(() => {
    if (!drawnPolygon) return;

    const loadAllLayers = async () => {
      await Promise.all([
        fetchLayerWithPolygon("ndvi", setNdviTileUrl),
        fetchLayerWithPolygon("lst", setLstTileUrl),
        fetchLayerWithPolygon("nighttime-lights", setNighttimeLightsTileUrl),
        fetchLayerWithPolygon("population-density", setPopulationTileUrl),
        fetchLayerWithPolygon("priority-zones", setPriorityZonesTileUrl),
      ]);
    };

    loadAllLayers();
  }, [drawnPolygon, fetchLayerWithPolygon]);

  useEffect(() => {
    if (!drawnPolygon) return;

    const fetchAnalysis = async () => {
      setLoadingLayers((prev) => prev + 1);
      try {
        const activeLayers = {
          ndvi: true,
          lst: true,
          nighttimeLights: true,
          population: true,
          priorityZones: true,
        };

        const url = `${API_URL}/priority-analysis-polygon?year=${DEFAULT_YEAR}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coordinates: drawnPolygon, activeLayers }),
        });
        const data = await response.json();
        setPriorityAnalysis(data);
      } catch (error) {
        console.error("Error fetching priority analysis:", error);
      } finally {
        setLoadingLayers((prev) => prev - 1);
      }
    };

    fetchAnalysis();
  }, [drawnPolygon]);

  const handleGenerateAIRecommendations = useCallback(async () => {
    if (!drawnPolygon || !priorityAnalysis) return;

    setIsLoadingAI(true);
    try {
      const activeLayers = {
        ndvi: !!ndviTileUrl,
        lst: !!lstTileUrl,
        nighttimeLights: !!nighttimeLightsTileUrl,
        population: !!populationTileUrl,
        priorityZones: !!priorityZonesTileUrl,
      };

      const html2canvas = (await import("html2canvas")).default;
      const layerMetadata = [
        {
          id: "reference",
          name: "Mapa de Referencia",
          description: "Vista general del área con calles y edificaciones"
        },
        {
          id: "ndvi",
          name: "Índice de Vegetación (NDVI)",
          description: "Verde oscuro = alta vegetación (>0.6), Verde claro = media (0.3-0.6), Beige = baja (<0.3)",
          active: !!ndviTileUrl
        },
        {
          id: "lst",
          name: "Temperatura Superficial (LST)",
          description: "Rojo = crítica (>40°C), Amarillo = alta (35-40°C), Azul = normal (<35°C)",
          active: !!lstTileUrl
        },
        {
          id: "nighttimeLights",
          name: "Luces Nocturnas (VIIRS)",
          description: "Blanco = alta actividad, Amarillo = media, Púrpura = baja",
          active: !!nighttimeLightsTileUrl
        },
        {
          id: "population",
          name: "Densidad Poblacional",
          description: "Rojo oscuro = muy alta (>150 hab/ha), Naranja = alta (100-150), Amarillo = media (<100)",
          active: !!populationTileUrl
        },
        {
          id: "priorityZones",
          name: "Zonas Prioritarias",
          description: "Rojo oscuro = crítico (score >6), Naranja = alto (4-6), Amarillo = moderado (<4)",
          active: !!priorityZonesTileUrl
        }
      ];

      const mapImages = [];
      const mapContainers = document.querySelectorAll(".leaflet-container");
      
      for (let i = 0; i < Math.min(mapContainers.length, 6); i++) {
        const metadata = layerMetadata[i];
        if (!metadata || (metadata.id !== "reference" && !metadata.active)) continue;

        try {
          const canvas = await html2canvas(mapContainers[i], {
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#1e293b",
            scale: 1.5,
            logging: false,
          });
          mapImages.push({
            data: canvas.toDataURL("image/jpeg", 0.6),
            metadata: {
              layerId: metadata.id,
              layerName: metadata.name,
              description: metadata.description
            }
          });
        } catch (err) {
          console.warn(`Error capturing map ${i}:`, err);
        }
      }

      const response = await fetch(
        `${API_URL}/ai-park-recommendations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coordinates: drawnPolygon,
            analysisData: priorityAnalysis,
            activeLayers,
            mapImages,
          }),
        }
      );

      const data = await response.json();
      setParkRecommendations(data);
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
    } finally {
      setIsLoadingAI(false);
    }
  }, [drawnPolygon, priorityAnalysis, ndviTileUrl, lstTileUrl, nighttimeLightsTileUrl, populationTileUrl, priorityZonesTileUrl]);

  const activeLayers = {
    ndvi: !!ndviTileUrl,
    lst: !!lstTileUrl,
    nighttimeLights: !!nighttimeLightsTileUrl,
    population: !!populationTileUrl,
    priorityZones: !!priorityZonesTileUrl,
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar
        priorityAnalysis={priorityAnalysis}
        onCitySelect={handleCitySelect}
        parkRecommendations={parkRecommendations}
        drawnPolygon={drawnPolygon}
        activeLayers={activeLayers}
        isGridView={!!drawnPolygon}
      />
      <MapContainerWrapper
        ndviTileUrl={ndviTileUrl}
        lstTileUrl={lstTileUrl}
        nighttimeLightsTileUrl={nighttimeLightsTileUrl}
        populationTileUrl={populationTileUrl}
        priorityZonesTileUrl={priorityZonesTileUrl}
        ndviOpacity={ndviOpacity}
        setNdviOpacity={setNdviOpacity}
        lstOpacity={lstOpacity}
        setLstOpacity={setLstOpacity}
        nighttimeLightsOpacity={nighttimeLightsOpacity}
        setNighttimeLightsOpacity={setNighttimeLightsOpacity}
        populationOpacity={populationOpacity}
        setPopulationOpacity={setPopulationOpacity}
        priorityZonesOpacity={priorityZonesOpacity}
        setPriorityZonesOpacity={setPriorityZonesOpacity}
        center={[mapCenter.lat, mapCenter.lng]}
        isLoading={loadingLayers > 0}
        onPolygonCreated={handlePolygonCreated}
        onPolygonDeleted={handlePolygonDeleted}
        layerOrder={layerOrder}
        drawnPolygon={drawnPolygon}
        parkRecommendations={parkRecommendations}
        onGenerateAIRecommendations={handleGenerateAIRecommendations}
        isLoadingAI={isLoadingAI}
      />
    </div>
  );
}

export default App;
