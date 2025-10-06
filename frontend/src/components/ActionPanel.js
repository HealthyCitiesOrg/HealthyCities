import ReportButton from "./ReportButton";
import { DEFAULT_YEAR } from "../config/constants";

const ActionPanel = ({ priorityAnalysis, activeLayers, parkRecommendations, isGridView }) => (
  <div className="p-4 border-t border-white/10">
    <ReportButton 
      priorityAnalysis={priorityAnalysis}
      activeLayers={activeLayers}
      year={DEFAULT_YEAR}
      parkRecommendations={parkRecommendations}
      isGridView={isGridView}
    />
  </div>
);

export default ActionPanel;
