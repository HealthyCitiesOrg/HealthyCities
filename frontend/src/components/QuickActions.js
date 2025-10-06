import { Sparkles } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const QuickActions = ({
  onGenerateAIRecommendations,
  hasActiveLayers,
  drawnPolygon,
  isLoadingAI,
}) => {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-10 left-10 flex gap-3 z-[1000]">
      {drawnPolygon && hasActiveLayers && (
        <button
          onClick={onGenerateAIRecommendations}
          disabled={isLoadingAI}
          className="flex items-center gap-2 bg-purple-600/90 backdrop-blur-xl hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-300 shadow-lg"
        >
          {isLoadingAI ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t("ai.analyzing")}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t("ai.recommendParks")}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default QuickActions;
