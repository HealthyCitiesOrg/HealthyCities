import SidebarHeader from "./SidebarHeader";
import IPIVIndicator from "./IPIVIndicator";
import StatisticsPanel from "./StatisticsPanel";
import ActionPanel from "./ActionPanel";
import SolutionsPanel from "./SolutionsPanel";
import ActionPlan from "./ActionPlan";
import CommunicationTools from "./CommunicationTools";
import ImpactProjection from "./ImpactProjection";
import { useTranslation } from "../hooks/useTranslation";

const Sidebar = ({
  priorityAnalysis,
  onCitySelect,
  parkRecommendations,
  drawnPolygon,
  activeLayers,
  isGridView,
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-96 flex flex-col bg-black/40 backdrop-blur-xl shadow-2xl border-r border-white/10 overflow-y-auto">
      <SidebarHeader onCitySelect={onCitySelect} />
      <div className="flex-1 overflow-y-auto">
        {drawnPolygon && (
          <>
            <IPIVIndicator priorityAnalysis={priorityAnalysis} />
            <StatisticsPanel priorityAnalysis={priorityAnalysis} />
            <div className="p-6 border-t border-white/10">
              <SolutionsPanel priorityAnalysis={priorityAnalysis} />
              {parkRecommendations && (
                <>
                  <ImpactProjection
                    parkRecommendations={parkRecommendations}
                    priorityAnalysis={priorityAnalysis}
                  />
                  <ActionPlan
                    parkRecommendations={parkRecommendations}
                    priorityAnalysis={priorityAnalysis}
                  />
                  <CommunicationTools
                    parkRecommendations={parkRecommendations}
                    priorityAnalysis={priorityAnalysis}
                  />
                </>
              )}
            </div>
            <div className="p-6 border-t border-white/10">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-400 text-sm font-medium mb-2">
                  💡 {t("sidebar.tip")}
                </p>
                <p className="text-white/70 text-xs leading-relaxed">
                  {t("sidebar.layerTip")}
                </p>
              </div>
            </div>
          </>
        )}
        {!drawnPolygon && (
          <div className="p-6 text-center">
            <div className="bg-white/5 rounded-xl p-8 border border-white/10">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <h3 className="text-white font-semibold mb-2">
                {t("sidebar.noAreaSelected")}
              </h3>
              <p className="text-white/60 text-sm">
                {t("sidebar.drawToAnalyze")}
              </p>
            </div>
          </div>
        )}
      </div>
      {drawnPolygon && (
        <ActionPanel
          priorityAnalysis={priorityAnalysis}
          parkRecommendations={parkRecommendations}
          activeLayers={activeLayers}
          isGridView={isGridView}
        />
      )}
    </div>
  );
};

export default Sidebar;
