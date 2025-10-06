import { useTranslation } from "../hooks/useTranslation";

const MapHeader = ({ isGridView, onToggleView }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-white text-xl">
            {t("map.interactiveSatellite")}
          </h2>
          <p className="text-white/50 text-xs mt-0.5">
            {t("map.nasaRealTime")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleView}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isGridView
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isGridView ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                />
              )}
            </svg>
            {isGridView ? t("map.singleView") : t("map.gridView")}
          </button>
          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-xs font-medium">
              {t("map.live")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapHeader;
