import { TreePine, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "../hooks/useTranslation";

const AIRecommendationsNotification = ({ parkRecommendations }) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (parkRecommendations?.parkRecommendations?.length > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [parkRecommendations]);

  if (!show || !parkRecommendations?.parkRecommendations?.length) return null;

  return (
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[1500] animate-slide-down">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl max-w-md">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
            <TreePine className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm mb-1">
              ✨ {t("ai.recommendationsGenerated")}
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              {t("ai.locationsIdentified", {
                count: parkRecommendations.parkRecommendations.length,
              })}{" "}
              <TreePine className="w-3 h-3 inline" /> {t("ai.lookForMarkers")}
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsNotification;
