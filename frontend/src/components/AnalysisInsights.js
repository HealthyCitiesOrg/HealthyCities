import { AlertCircle, TrendingUp, Sparkles, TreePine } from "lucide-react";

const AnalysisInsights = ({ priorityAnalysis }) => {
  if (!priorityAnalysis) return null;

  const { aiInsights, parkRecommendations } = priorityAnalysis;

  const getIconByType = (type) => {
    const icons = {
      heat: AlertCircle,
      vegetation: TreePine,
      population: AlertCircle,
      intervention: AlertCircle,
      general: TrendingUp,
    };
    return icons[type] || TrendingUp;
  };

  const recommendations = aiInsights?.recommendations || [];
  const parks = parkRecommendations?.parkRecommendations || [];
  const strategy = parkRecommendations?.generalStrategy || "";

  const priorityColors = {
    CRÍTICA: "bg-red-500/20 border-red-500/50 text-red-400",
    URGENTE: "bg-red-500/20 border-red-500/50 text-red-400",
    ALTA: "bg-orange-500/20 border-orange-500/50 text-orange-400",
    MEDIA: "bg-yellow-500/20 border-yellow-500/50 text-yellow-400",
    BAJA: "bg-green-500/20 border-green-500/50 text-green-400",
  };

  if (recommendations.length === 0 && parks.length === 0) {
    return (
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Dibuja un polígono para obtener recomendaciones de IA</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-white/10">
      <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-400" />
        Recomendaciones de IA
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {recommendations.map((rec, idx) => {
          const Icon = getIconByType(rec.type);
          return (
            <div
              key={idx}
              className="bg-white/5 rounded-lg p-3 border border-white/10"
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 text-blue-400" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-white text-xs">
                      {rec.title}
                    </h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${
                        priorityColors[rec.priority]
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs mb-2">
                    {rec.description}
                  </p>
                  <div className="space-y-1 mb-2">
                    {rec.actions.map((action, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-1.5"
                      >
                        <span className="text-blue-400 text-xs mt-0.5">•</span>
                        <span className="text-white/70 text-xs">{action}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                    👥 {rec.department}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {parks.length > 0 && (
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="w-4 h-4 text-green-400" />
              <h4 className="font-medium text-white text-xs">
                Espacios Verdes Recomendados
              </h4>
            </div>
            {parks.map((park, idx) => (
              <div
                key={idx}
                className="mb-3 last:mb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-xs font-medium">
                    {park.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded border ${
                      priorityColors[park.priority]
                    }`}
                  >
                    {park.priority}
                  </span>
                </div>
                <p className="text-white/60 text-xs mb-1">
                  📍 {park.location?.description || "Ubicación sugerida"}
                </p>
                <p className="text-white/60 text-xs mb-1">📏 {park.size}</p>
                <p className="text-white/70 text-xs mb-2">{park.reason}</p>
                <div className="space-y-1 mb-2">
                  {park.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-1.5"
                    >
                      <span className="text-green-400 text-xs">✓</span>
                      <span className="text-white/70 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
                <p className="text-white/50 text-xs italic">
                  🎯 {park.estimatedImpact}
                </p>
              </div>
            ))}
            {strategy && (
              <div className="mt-3 pt-3 border-t border-green-500/20">
                <p className="text-white/60 text-xs">
                  <span className="font-medium text-green-400">
                    Estrategia:
                  </span>{" "}
                  {strategy}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisInsights;
