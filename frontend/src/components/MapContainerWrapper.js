import RealMap from "./RealMap";
import GridMapView from "./GridMapView";
import MapHeader from "./MapHeader";
import QuickActions from "./QuickActions";
import AIRecommendationsNotification from "./AIRecommendationsNotification";
import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

const MapContainerWrapper = ({
  ndviTileUrl,
  lstTileUrl,
  nighttimeLightsTileUrl,
  populationTileUrl,
  priorityZonesTileUrl,
  ndviOpacity,
  setNdviOpacity,
  lstOpacity,
  setLstOpacity,
  nighttimeLightsOpacity,
  setNighttimeLightsOpacity,
  populationOpacity,
  setPopulationOpacity,
  priorityZonesOpacity,
  setPriorityZonesOpacity,
  center,
  isLoading,
  onPolygonCreated,
  onPolygonDeleted,
  layerOrder,
  drawnPolygon,
  parkRecommendations,
  onGenerateAIRecommendations,
  isLoadingAI,
}) => {
  const { t } = useTranslation();
  const [isGridView, setIsGridView] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (drawnPolygon) {
      setIsGridView(true);
    } else {
      setIsGridView(false);
    }
  }, [drawnPolygon]);

  if (!drawnPolygon) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6 relative">
          <RealMap
            center={center}
            onPolygonCreated={onPolygonCreated}
            onPolygonDeleted={onPolygonDeleted}
            drawnPolygon={drawnPolygon}
          />
          {showWelcome && (
            <>
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[1000]" />
              <div className="absolute inset-0 flex items-center justify-center z-[1001] pointer-events-none">
                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 max-w-md text-center relative pointer-events-auto">
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
                    aria-label={t("common.close")}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {t("map.welcome")}
                  </h2>
                  <p className="text-white/70 mb-6">{t("map.welcomeDesc")}</p>
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <polygon
                        points="12,2 22,9 18,22 6,22 2,9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {t("map.welcomeTip")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <MapHeader
        isGridView={isGridView}
        onToggleView={() => setIsGridView(!isGridView)}
        drawnPolygon={drawnPolygon}
      />
      <div className="flex-1 p-6 relative">
        <AIRecommendationsNotification
          parkRecommendations={parkRecommendations}
        />
        {isGridView ? (
          <GridMapView
            ndviTileUrl={ndviTileUrl}
            lstTileUrl={lstTileUrl}
            nighttimeLightsTileUrl={nighttimeLightsTileUrl}
            populationTileUrl={populationTileUrl}
            priorityZonesTileUrl={priorityZonesTileUrl}
            ndviOpacity={ndviOpacity}
            lstOpacity={lstOpacity}
            nighttimeLightsOpacity={nighttimeLightsOpacity}
            populationOpacity={populationOpacity}
            priorityZonesOpacity={priorityZonesOpacity}
            setNdviOpacity={setNdviOpacity}
            setLstOpacity={setLstOpacity}
            setNighttimeLightsOpacity={setNighttimeLightsOpacity}
            setPopulationOpacity={setPopulationOpacity}
            setPriorityZonesOpacity={setPriorityZonesOpacity}
            center={center}
            isLoading={isLoading}
            drawnPolygon={drawnPolygon}
            parkRecommendations={parkRecommendations}
          />
        ) : (
          <RealMap
            ndviTileUrl={ndviTileUrl}
            lstTileUrl={lstTileUrl}
            nighttimeLightsTileUrl={nighttimeLightsTileUrl}
            populationTileUrl={populationTileUrl}
            priorityZonesTileUrl={priorityZonesTileUrl}
            ndviOpacity={ndviOpacity}
            lstOpacity={lstOpacity}
            nighttimeLightsOpacity={nighttimeLightsOpacity}
            populationOpacity={populationOpacity}
            priorityZonesOpacity={priorityZonesOpacity}
            center={center}
            onPolygonCreated={onPolygonCreated}
            onPolygonDeleted={onPolygonDeleted}
            layerOrder={layerOrder}
            drawnPolygon={drawnPolygon}
            parkRecommendations={parkRecommendations}
          />
        )}
        <QuickActions
          onGenerateAIRecommendations={onGenerateAIRecommendations}
          drawnPolygon={drawnPolygon}
          isLoadingAI={isLoadingAI}
          hasActiveLayers={true}
        />
      </div>
    </div>
  );
};

export default MapContainerWrapper;
