import { Activity } from "lucide-react";
import CitySearch from "./CitySearch";
import { useLanguage } from "../contexts/LanguageContext";

const SidebarHeader = ({ onCitySelect }) => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              {t("app.title")}
            </h1>
            <p className="text-white/50 text-xs">{t("app.version")}</p>
          </div>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-colors text-xs font-semibold"
        >
          <span
            className={language === "es" ? "text-blue-400" : "text-white/50"}
          >
            ES
          </span>
          <span className="text-white/30">|</span>
          <span
            className={language === "en" ? "text-blue-400" : "text-white/50"}
          >
            EN
          </span>
        </button>
      </div>
      <p className="text-white/60 text-xs leading-relaxed">
        {t("app.description")}
      </p>
      <div className="mt-3">
        <CitySearch onCitySelect={onCitySelect} />
      </div>
    </div>
  );
};

export default SidebarHeader;
