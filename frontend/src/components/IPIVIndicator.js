import { Target, TrendingUp, AlertCircle } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const IPIVIndicator = ({ priorityAnalysis }) => {
  const { t } = useTranslation();

  if (!priorityAnalysis?.ipiv) return null;

  const { ipiv, interventionLevel, analysis } = priorityAnalysis;

  const getColorClass = () => {
    if (ipiv > 7) return "from-red-600 via-red-500 to-orange-500";
    if (ipiv > 5) return "from-orange-500 via-yellow-500 to-yellow-400";
    if (ipiv > 3) return "from-yellow-400 via-green-400 to-green-500";
    return "from-green-500 via-emerald-500 to-teal-500";
  };

  return (
    <div className="p-4 border-b border-white/10">
      <div
        className={`bg-gradient-to-r ${getColorClass()} rounded-lg p-4 shadow-lg`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-white" />
            <h3 className="font-bold text-white text-lg">
              {t("statistics.ipivFull")}
            </h3>
          </div>
          {ipiv > 5 && (
            <AlertCircle className="w-6 h-6 text-white animate-pulse" />
          )}
        </div>

        <div className="flex items-end gap-4 mb-3">
          <div className="text-5xl font-bold text-white">{ipiv.toFixed(1)}</div>
          <div className="text-2xl text-white/80 mb-1">/10</div>
          <div className="flex-1 text-right">
            <div className="text-sm text-white/70 uppercase tracking-wide">
              {t("statistics.priority")}
            </div>
            <div className="text-xl font-semibold text-white capitalize">
              {interventionLevel}
            </div>
          </div>
        </div>

        <div className="bg-white/20 rounded-full h-3 mb-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${(ipiv / 10) * 100}%` }}
          />
        </div>

        <div className="text-sm text-white/90 leading-relaxed">
          {analysis.recommendation}
        </div>
      </div>
    </div>
  );
};

export default IPIVIndicator;
