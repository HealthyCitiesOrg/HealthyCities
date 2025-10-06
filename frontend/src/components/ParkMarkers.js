import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { TreePine } from "lucide-react";
import { renderToString } from "react-dom/server";
import { useTranslation } from "../hooks/useTranslation";

const createParkIcon = (priority) => {
  const colors = {
    CRÍTICA: "#ef4444",
    ALTA: "#f97316",
    MEDIA: "#eab308",
  };

  const color = colors[priority] || "#22c55e";

  const iconHtml = renderToString(
    <div
      style={{
        backgroundColor: color,
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "3px solid white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      <TreePine color="white" size={24} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-park-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const ParkMarkers = ({
  parkRecommendations,
  showPopup = true,
  showTooltip = true,
}) => {
  const { t } = useTranslation();

  if (!parkRecommendations?.parkRecommendations) return null;

  return (
    <>
      {parkRecommendations.parkRecommendations.map((park, idx) => {
        if (!park.location?.lat || !park.location?.lng) return null;

        return (
          <Marker
            key={idx}
            position={[park.location.lat, park.location.lng]}
            icon={createParkIcon(park.priority)}
          >
            {showTooltip && (
              <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                <div className="text-xs font-semibold">{park.type}</div>
              </Tooltip>
            )}
            {showPopup && (
              <Popup maxWidth={320} className="park-popup">
                <div className="p-3">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h3 className="font-bold text-base text-gray-800">
                      {park.type}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                        park.priority === "CRÍTICA"
                          ? "bg-red-100 text-red-700"
                          : park.priority === "ALTA"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {park.priority}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-start gap-2">
                      <span className="text-base">📍</span>
                      <p className="text-xs text-gray-600 flex-1">
                        {park.location.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base">📏</span>
                      <p className="text-xs text-gray-700 font-medium">
                        {park.size}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        💡 {t("ai.reason")}:
                      </p>
                      <p className="text-xs text-blue-800 leading-relaxed">
                        {park.reason}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2.5 border border-green-100">
                      <p className="text-xs font-semibold text-green-900 mb-1.5">
                        ✨ {t("ai.features")}:
                      </p>
                      <ul className="text-xs text-green-800 space-y-1">
                        {park.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-green-600 mt-0.5">•</span>
                            <span className="flex-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-100">
                      <p className="text-xs font-semibold text-purple-900 mb-1">
                        🎯 Impacto Estimado:
                      </p>
                      <p className="text-xs text-purple-800 leading-relaxed">
                        {park.estimatedImpact}
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
};

export default ParkMarkers;
