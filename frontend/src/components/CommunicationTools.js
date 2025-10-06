import { FileText, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const CommunicationTools = ({ parkRecommendations, priorityAnalysis }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  if (!parkRecommendations?.parkRecommendations?.length) return null;

  const generateExecutiveSummary = () => {
    const totalBudget = parkRecommendations.parkRecommendations.reduce(
      (sum, park) => {
        const sizeMultiplier = park.size.includes("pequeño")
          ? 1
          : park.size.includes("mediano")
          ? 2
          : 3;
        const priorityMultiplier =
          park.priority === "CRÍTICA"
            ? 1.3
            : park.priority === "ALTA"
            ? 1.15
            : 1;
        return sum + 50000 * sizeMultiplier * priorityMultiplier;
      },
      0
    );

    return `${t("communicationTools.summaryTitle")}

${t("communicationTools.currentSituation")}:
- ${t(
      "communicationTools.avgTemperature"
    )}: ${priorityAnalysis?.avgTemperature?.toFixed(1)}°C
- ${t("communicationTools.vegetationIndex")}: ${(
      (priorityAnalysis?.avgNdvi || 0) * 100
    ).toFixed(1)}%
- ${t("communicationTools.affectedPopulation")}: ${Math.round(
      priorityAnalysis?.totalPopulation || 0
    ).toLocaleString("es-ES")} ${t("communicationTools.residents")}
- ${t("communicationTools.interventionLevel")}: ${
      priorityAnalysis?.interventionLevel || "N/A"
    }

${t("communicationTools.proposal")}:
${t("communicationTools.proposalDescription", {
  count: parkRecommendations.parkRecommendations.length,
})}

${t(
  "communicationTools.estimatedTotalInvestment"
)}: $${totalBudget.toLocaleString("es-ES")} USD

${t("communicationTools.expectedBenefits")}:
- ${t("communicationTools.benefitTempReduction")}
- ${t("communicationTools.benefitAirQuality")}
- ${t("communicationTools.benefitGreenSpace")}
- ${t("communicationTools.benefitQualityOfLife")}

${t("communicationTools.priorityInterventions")}:
${parkRecommendations.parkRecommendations
  .map(
    (park, idx) =>
      `${idx + 1}. ${park.type} - ${park.location.description} (${t(
        "communicationTools.priority"
      )}: ${park.priority})`
  )
  .join("\n")}

${t("communicationTools.timeline")}:
- ${t("communicationTools.phase1")}
- ${t("communicationTools.phase2")}
- ${t("communicationTools.phase3")}

${t("communicationTools.backedBy")}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 space-y-3">
      <h3 className="text-sm font-bold text-white/90 flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        {t("communicationTools.title")}
      </h3>

      <div className="space-y-2">
        <button
          onClick={() => copyToClipboard(generateExecutiveSummary())}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-blue-600/80 hover:bg-blue-600 rounded-lg text-sm text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>{t("communicationTools.executiveSummary")}</span>
          </div>
          {copied && (
            <span className="text-xs">✓ {t("communicationTools.copied")}</span>
          )}
        </button>

        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-white/70 leading-relaxed">
            {t("communicationTools.usageDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationTools;
