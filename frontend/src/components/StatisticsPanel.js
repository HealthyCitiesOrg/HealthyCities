import {
  Users,
  Leaf,
  Thermometer,
  Target,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import StatCard from "./StatCard";
import { useTranslation } from "../hooks/useTranslation";

const StatisticsPanel = ({ priorityAnalysis }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-white/10">
      <h3 className="font-semibold text-white mb-3 text-sm">
        {t("statistics.title")}
      </h3>
      <div className="space-y-3">
        <StatCard
          icon={Thermometer}
          title={t("statistics.avgTemp")}
          value={
            priorityAnalysis?.avgTemperature
              ? `${priorityAnalysis.avgTemperature.toFixed(1)}°C`
              : "--"
          }
          subtitle={
            !priorityAnalysis
              ? t("statistics.waitingData")
              : priorityAnalysis.analysis.heatStatus === "critical"
              ? t("statistics.criticalZone")
              : priorityAnalysis.analysis.heatStatus === "high"
              ? t("statistics.riskZone")
              : t("statistics.normalZone")
          }
          color={
            !priorityAnalysis
              ? "from-gray-500 to-gray-600"
              : priorityAnalysis.analysis.heatStatus === "critical"
              ? "from-red-600 to-red-500"
              : priorityAnalysis.analysis.heatStatus === "high"
              ? "from-orange-500 to-red-400"
              : "from-blue-500 to-cyan-500"
          }
          trend={
            !priorityAnalysis
              ? t("statistics.noData")
              : priorityAnalysis.analysis.heatStatus === "critical"
              ? t("statistics.critical")
              : priorityAnalysis.analysis.heatStatus === "high"
              ? t("statistics.high")
              : t("statistics.normal")
          }
          trendIcon={
            !priorityAnalysis
              ? Loader2
              : priorityAnalysis.analysis.heatStatus === "critical" ||
                priorityAnalysis.analysis.heatStatus === "high"
              ? AlertCircle
              : CheckCircle
          }
          trendColor={
            !priorityAnalysis
              ? "text-gray-400"
              : priorityAnalysis.analysis.heatStatus === "critical"
              ? "text-red-400"
              : priorityAnalysis.analysis.heatStatus === "high"
              ? "text-orange-400"
              : "text-green-400"
          }
          action={
            priorityAnalysis?.analysis.heatStatus === "critical"
              ? t("statistics.tempActionCritical")
              : priorityAnalysis?.analysis.heatStatus === "high"
              ? t("statistics.tempActionHigh")
              : null
          }
          actionColor={
            priorityAnalysis?.analysis.heatStatus === "critical"
              ? "text-red-400"
              : "text-yellow-400"
          }
        />
        <StatCard
          icon={Leaf}
          title={t("statistics.vegIndex")}
          value={
            priorityAnalysis?.avgNdvi
              ? (priorityAnalysis.avgNdvi * 100).toFixed(1) + "%"
              : "--"
          }
          subtitle={
            !priorityAnalysis
              ? t("statistics.waitingData")
              : priorityAnalysis.analysis.vegetationStatus === "critical"
              ? t("statistics.criticalCoverage")
              : priorityAnalysis.analysis.vegetationStatus === "moderate"
              ? t("statistics.moderateCoverage")
              : t("statistics.goodCoverage")
          }
          color={
            !priorityAnalysis
              ? "from-gray-500 to-gray-600"
              : priorityAnalysis.analysis.vegetationStatus === "critical"
              ? "from-red-600 to-orange-500"
              : priorityAnalysis.analysis.vegetationStatus === "moderate"
              ? "from-yellow-500 to-green-500"
              : "from-green-500 to-emerald-500"
          }
          trend={
            !priorityAnalysis
              ? t("statistics.noData")
              : priorityAnalysis.analysis.vegetationStatus === "critical"
              ? t("statistics.critical")
              : priorityAnalysis.analysis.vegetationStatus === "moderate"
              ? t("statistics.moderate")
              : t("statistics.good")
          }
          trendIcon={
            !priorityAnalysis
              ? Loader2
              : priorityAnalysis.analysis.vegetationStatus === "critical"
              ? TrendingDown
              : priorityAnalysis.analysis.vegetationStatus === "moderate"
              ? AlertCircle
              : TrendingUp
          }
          trendColor={
            !priorityAnalysis
              ? "text-gray-400"
              : priorityAnalysis.analysis.vegetationStatus === "critical"
              ? "text-red-400"
              : priorityAnalysis.analysis.vegetationStatus === "moderate"
              ? "text-yellow-400"
              : "text-green-400"
          }
          action={
            priorityAnalysis?.analysis.vegetationStatus === "critical"
              ? t("statistics.vegActionCritical")
              : priorityAnalysis?.analysis.vegetationStatus === "moderate"
              ? t("statistics.vegActionModerate")
              : null
          }
          actionColor={
            priorityAnalysis?.analysis.vegetationStatus === "critical"
              ? "text-red-400"
              : "text-yellow-400"
          }
        />
        <StatCard
          icon={Target}
          title={t("statistics.priorityScore")}
          value={
            priorityAnalysis?.priorityScore
              ? `${priorityAnalysis.priorityScore.toFixed(1)}/8`
              : "--"
          }
          subtitle={
            !priorityAnalysis
              ? t("statistics.waitingData")
              : priorityAnalysis.analysis.needsIntervention
              ? t("statistics.needsIntervention")
              : t("statistics.noUrgentIntervention")
          }
          color={
            !priorityAnalysis
              ? "from-gray-500 to-gray-600"
              : priorityAnalysis.priorityScore > 6
              ? "from-red-600 to-red-500"
              : priorityAnalysis.priorityScore > 4
              ? "from-orange-500 to-yellow-500"
              : "from-green-500 to-emerald-500"
          }
          trend={
            !priorityAnalysis
              ? t("statistics.noData")
              : priorityAnalysis.priorityScore > 6
              ? t("statistics.critical")
              : priorityAnalysis.priorityScore > 4
              ? t("statistics.high")
              : t("statistics.low")
          }
          trendIcon={
            !priorityAnalysis
              ? Loader2
              : priorityAnalysis.priorityScore > 6
              ? AlertCircle
              : priorityAnalysis.priorityScore > 4
              ? TrendingUp
              : CheckCircle
          }
          trendColor={
            !priorityAnalysis
              ? "text-gray-400"
              : priorityAnalysis.priorityScore > 6
              ? "text-red-400"
              : priorityAnalysis.priorityScore > 4
              ? "text-orange-400"
              : "text-green-400"
          }
          action={
            priorityAnalysis?.analysis.needsIntervention
              ? t("statistics.actionRequired")
              : null
          }
          actionColor="text-red-400"
        />
        <StatCard
          icon={Users}
          title={t("statistics.totalPopulation")}
          value={
            priorityAnalysis?.totalPopulation
              ? Math.round(priorityAnalysis.totalPopulation).toLocaleString()
              : "--"
          }
          subtitle={
            !priorityAnalysis
              ? t("statistics.waitingData")
              : t("statistics.inhabitants")
          }
          color={
            !priorityAnalysis
              ? "from-gray-500 to-gray-600"
              : "from-purple-500 to-pink-500"
          }
          trend={
            !priorityAnalysis
              ? t("statistics.noData")
              : priorityAnalysis.totalPopulation > 10000
              ? t("statistics.densityHigh")
              : priorityAnalysis.totalPopulation > 5000
              ? t("statistics.densityMedium")
              : t("statistics.densityLow")
          }
          trendIcon={!priorityAnalysis ? Loader2 : Users}
          trendColor={
            !priorityAnalysis
              ? "text-gray-400"
              : priorityAnalysis.totalPopulation > 10000
              ? "text-purple-400"
              : "text-purple-300"
          }
        />
      </div>
    </div>
  );
};

export default StatisticsPanel;
