import { Lightbulb, TrendingDown, Droplets, Wind } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const SolutionsPanel = ({ priorityAnalysis }) => {
  const { t } = useTranslation();

  if (!priorityAnalysis) return null;

  const generateSolutions = () => {
    const solutions = [];
    const { avgTemperature, avgNdvi, analysis } = priorityAnalysis;

    if (avgTemperature > 35) {
      solutions.push({
        icon: TrendingDown,
        category: t("solutionsPanel.tempReduction"),
        color: "red",
        actions: [
          t("solutionsPanel.tempAction1"),
          t("solutionsPanel.tempAction2"),
          t("solutionsPanel.tempAction3"),
          t("solutionsPanel.tempAction4"),
        ],
        impact: t("solutionsPanel.tempImpact"),
      });
    }

    if (avgNdvi < 0.3) {
      solutions.push({
        icon: Lightbulb,
        category: t("solutionsPanel.vegIncrease"),
        color: "green",
        actions: [
          t("solutionsPanel.vegAction1"),
          t("solutionsPanel.vegAction2"),
          t("solutionsPanel.vegAction3"),
          t("solutionsPanel.vegAction4"),
        ],
        impact: t("solutionsPanel.vegImpact"),
      });
    }

    if (avgTemperature > 33 || avgNdvi < 0.35) {
      solutions.push({
        icon: Droplets,
        category: t("solutionsPanel.waterManagement"),
        color: "blue",
        actions: [
          t("solutionsPanel.waterAction1"),
          t("solutionsPanel.waterAction2"),
          t("solutionsPanel.waterAction3"),
          t("solutionsPanel.waterAction4"),
        ],
        impact: t("solutionsPanel.waterImpact"),
      });
    }

    solutions.push({
      icon: Wind,
      category: t("solutionsPanel.airQuality"),
      color: "purple",
      actions: [
        t("solutionsPanel.airAction1"),
        t("solutionsPanel.airAction2"),
        t("solutionsPanel.airAction3"),
        t("solutionsPanel.airAction4"),
      ],
      impact: t("solutionsPanel.airImpact"),
    });

    return solutions;
  };

  const solutions = generateSolutions();
  const colorClasses = {
    red: "bg-red-500/10 border-red-500/30 text-red-300",
    green: "bg-green-500/10 border-green-500/30 text-green-300",
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-300",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-300",
  };

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
        <Lightbulb className="w-4 h-4" />
        {t("solutionsPanel.title")}
      </h3>

      <div className="space-y-2">
        {solutions.map((solution, idx) => (
          <div
            key={idx}
            className={`rounded-lg p-3 border ${colorClasses[solution.color]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <solution.icon className="w-4 h-4" />
              <span className="text-xs font-semibold">{solution.category}</span>
            </div>

            <ul className="space-y-1.5 mb-2">
              {solution.actions.map((action, aIdx) => (
                <li
                  key={aIdx}
                  className="text-xs text-white/70 flex items-start gap-1.5"
                >
                  <span className="mt-0.5">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>

            <div className="text-xs font-medium text-white/80 bg-white/5 rounded px-2 py-1">
              {solution.impact}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
        <p className="text-xs text-yellow-300 leading-relaxed">
          💡 <strong>{t("solutionsPanel.integratedApproach")}</strong>{" "}
          {t("solutionsPanel.integratedDesc")}
        </p>
      </div>
    </div>
  );
};

export default SolutionsPanel;
