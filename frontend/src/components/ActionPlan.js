import { CheckCircle2, Clock, Users, DollarSign, FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const ActionPlan = ({ parkRecommendations, priorityAnalysis }) => {
  const { t } = useTranslation();
  const [selectedPark, setSelectedPark] = useState(null);

  if (!parkRecommendations?.parkRecommendations?.length) return null;

  const generateActionSteps = (park) => {
    const baseSteps = [
      {
        phase: t("actionPlan.phaseImmediate"),
        icon: Clock,
        steps: [
          t("actionPlan.stepFeasibility"),
          t("actionPlan.stepCommunityConsultation"),
          t("actionPlan.stepTopographicSurvey"),
        ],
      },
      {
        phase: t("actionPlan.phaseShortTerm"),
        icon: Users,
        steps: [
          t("actionPlan.stepArchitecturalDesign"),
          t("actionPlan.stepPermitApproval"),
          t("actionPlan.stepBidding"),
        ],
      },
      {
        phase: t("actionPlan.phaseMediumTerm"),
        icon: CheckCircle2,
        steps: [
          t("actionPlan.stepConstructionStart"),
          t("actionPlan.stepPlanting"),
          t("actionPlan.stepFurnitureInstallation"),
        ],
      },
      {
        phase: t("actionPlan.phaseMaintenance"),
        icon: CheckCircle2,
        steps: [
          t("actionPlan.stepMaintenanceProgram"),
          t("actionPlan.stepImpactMonitoring"),
          t("actionPlan.stepCommunityActivities"),
        ],
      },
    ];
    return baseSteps;
  };

  const estimateBudget = (park) => {
    const sizeMultiplier = park.size.includes("pequeño")
      ? 1
      : park.size.includes("mediano")
      ? 2
      : 3;
    const priorityMultiplier =
      park.priority === "CRÍTICA" ? 1.3 : park.priority === "ALTA" ? 1.15 : 1;

    const baseCost = 50000 * sizeMultiplier * priorityMultiplier;

    return {
      total: baseCost,
      breakdown: [
        { item: t("actionPlan.budgetStudies"), amount: baseCost * 0.15 },
        { item: t("actionPlan.budgetLandPrep"), amount: baseCost * 0.2 },
        { item: t("actionPlan.budgetVegetation"), amount: baseCost * 0.25 },
        { item: t("actionPlan.budgetInfrastructure"), amount: baseCost * 0.2 },
        { item: t("actionPlan.budgetFurniture"), amount: baseCost * 0.1 },
        { item: t("actionPlan.budgetContingencies"), amount: baseCost * 0.1 },
      ],
    };
  };

  const generateCommunicationTemplate = (park) => {
    const budget = estimateBudget(park);
    return `${t("actionPlan.proposalTitle")}

${t("actionPlan.proposalLocation")}: ${park.location.description}
${t("actionPlan.proposalType")}: ${park.type}
${t("actionPlan.proposalPriority")}: ${park.priority}

${t("actionPlan.proposalJustification")}:
${park.reason}

${t("actionPlan.proposalExpectedImpact")}:
${park.estimatedImpact}

${t("actionPlan.proposalEstimatedInvestment")}: $${budget.total.toLocaleString(
      "es-ES"
    )} USD

${t("actionPlan.proposalCommunityBenefits")}:
${park.features.map((f, i) => `${i + 1}. ${f}`).join("\n")}

${t("actionPlan.proposalTechnicalData")}:
- ${t(
      "actionPlan.proposalCurrentTemp"
    )}: ${priorityAnalysis?.avgTemperature?.toFixed(1)}°C
- ${t("actionPlan.proposalVegetationIndex")}: ${(
      (priorityAnalysis?.avgNdvi || 0) * 100
    ).toFixed(1)}%
- ${t("actionPlan.proposalBeneficiaryPopulation")}: ${Math.round(
      priorityAnalysis?.totalPopulation || 0
    ).toLocaleString("es-ES")} ${t("actionPlan.proposalResidents")}

${t("actionPlan.proposalBackedBy")}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4" />
        {t("actionPlan.title")}
      </h3>

      <div className="space-y-2">
        {parkRecommendations.parkRecommendations.map((park, idx) => (
          <div
            key={idx}
            className="bg-white/5 rounded-lg p-3 border border-white/10"
          >
            <button
              onClick={() => setSelectedPark(selectedPark === idx ? null : idx)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white/80">
                  {idx + 1}. {park.type}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    park.priority === "CRÍTICA"
                      ? "bg-red-500/20 text-red-300"
                      : park.priority === "ALTA"
                      ? "bg-orange-500/20 text-orange-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {park.priority}
                </span>
              </div>
            </button>

            {selectedPark === idx && (
              <div className="mt-3 space-y-3 animate-fade-in">
                {/* Pasos de acción */}
                <div className="space-y-2">
                  {generateActionSteps(park).map((phase, pIdx) => (
                    <div key={pIdx} className="bg-white/5 rounded p-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <phase.icon className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-300">
                          {phase.phase}
                        </span>
                      </div>
                      <ul className="space-y-1 ml-5">
                        {phase.steps.map((step, sIdx) => (
                          <li
                            key={sIdx}
                            className="text-xs text-white/70 flex items-start gap-1.5"
                          >
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Presupuesto */}
                <div className="bg-green-500/10 rounded p-2 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-semibold text-green-300">
                      {t("actionPlan.budgetTitle")}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-green-300 mb-2">
                    ${estimateBudget(park).total.toLocaleString("es-ES")} USD
                  </div>
                  <div className="space-y-1">
                    {estimateBudget(park).breakdown.map((item, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex justify-between text-xs text-white/60"
                      >
                        <span>{item.item}</span>
                        <span>${item.amount.toLocaleString("es-ES")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plantilla de comunicación */}
                <button
                  onClick={() =>
                    copyToClipboard(generateCommunicationTemplate(park))
                  }
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600/80 hover:bg-purple-600 rounded text-xs text-white transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  {t("actionPlan.copyProposal")}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionPlan;
