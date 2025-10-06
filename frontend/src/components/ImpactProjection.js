import { TrendingUp, Users, Thermometer, Leaf } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const ImpactProjection = ({ parkRecommendations, priorityAnalysis }) => {
  const { t } = useTranslation();

  if (!parkRecommendations?.parkRecommendations?.length || !priorityAnalysis)
    return null;

  const calculateProjectedImpact = () => {
    const currentTemp = priorityAnalysis.avgTemperature || 0;
    const currentNdvi = priorityAnalysis.avgNdvi || 0;
    const population = priorityAnalysis.totalPopulation || 0;

    const criticalCount = parkRecommendations.parkRecommendations.filter(
      (p) => p.priority === "CRÍTICA"
    ).length;
    const highCount = parkRecommendations.parkRecommendations.filter(
      (p) => p.priority === "ALTA"
    ).length;

    const tempReduction =
      criticalCount * 1.5 +
      highCount * 1.0 +
      (parkRecommendations.parkRecommendations.length -
        criticalCount -
        highCount) *
        0.5;
    const ndviIncrease = parkRecommendations.parkRecommendations.length * 0.05;
    const beneficiaries = Math.min(population, population * 0.6);

    const totalArea = parkRecommendations.parkRecommendations.reduce(
      (sum, park) => {
        if (park.size.includes("pequeño")) return sum + 0.3;
        if (park.size.includes("mediano")) return sum + 1.5;
        return sum + 3.5;
      },
      0
    );

    return {
      tempReduction: Math.min(tempReduction, 5),
      projectedTemp: Math.max(currentTemp - tempReduction, 25),
      ndviIncrease: Math.min(ndviIncrease, 0.3),
      projectedNdvi: Math.min(currentNdvi + ndviIncrease, 0.8),
      beneficiaries,
      totalArea,
      greenSpacePerCapita: (totalArea * 10000) / population,
    };
  };

  const impact = calculateProjectedImpact();

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        {t("impact.title")}
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg p-3 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className="w-4 h-4 text-red-300" />
            <span className="text-xs font-semibold text-red-300">
              {t("impact.temperature")}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {impact.projectedTemp.toFixed(1)}°C
              </span>
              <span className="text-xs text-white/60">
                {t("impact.projected")}
              </span>
            </div>
            <div className="text-xs text-green-300">
              ↓ {impact.tempReduction.toFixed(1)}°C {t("impact.reduction")}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-3 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-green-300" />
            <span className="text-xs font-semibold text-green-300">
              {t("impact.vegetation")}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {(impact.projectedNdvi * 100).toFixed(0)}%
              </span>
              <span className="text-xs text-white/60">NDVI</span>
            </div>
            <div className="text-xs text-green-300">
              ↑ {(impact.ndviIncrease * 100).toFixed(0)}% {t("impact.increase")}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-300" />
            <span className="text-xs font-semibold text-blue-300">
              {t("impact.beneficiaries")}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {Math.round(impact.beneficiaries).toLocaleString("es-ES")}
              </span>
            </div>
            <div className="text-xs text-white/60">
              {t("impact.impactedResidents")}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-3 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-semibold text-purple-300">
              {t("impact.greenSpace")}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-white">
                {impact.greenSpacePerCapita.toFixed(1)}
              </span>
              <span className="text-xs text-white/60">
                {t("impact.perCapita")}
              </span>
            </div>
            <div className="text-xs text-white/60">
              {impact.totalArea.toFixed(1)} ha {t("impact.totalArea")}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg p-3 border border-green-500/20">
        <p className="text-xs text-white/80 leading-relaxed">
          <strong className="text-green-300">✓ {t("impact.whoGoal")}</strong>{" "}
          {t("impact.whoRecommendation")}
          {impact.greenSpacePerCapita >= 9
            ? " " + t("impact.meetsStandard")
            : " " +
              t("impact.additionalRequired", {
                amount: (9 - impact.greenSpacePerCapita).toFixed(1),
              })}
        </p>
      </div>
    </div>
  );
};

export default ImpactProjection;
