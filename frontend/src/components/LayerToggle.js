import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";

const LayerToggle = ({
  icon: Icon,
  label,
  isActive,
  onChange,
  color,
  count,
  opacity,
  onOpacityChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="group relative">
      <button
        onClick={onChange}
        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
          isActive
            ? `${color} border-white/40 shadow-md`
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-sm"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg transition-colors duration-200 ${
              isActive ? "bg-white/20" : "bg-white/10"
            }`}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <p className="font-medium text-white text-sm">{label}</p>
            {count && (
              <p className="text-white/60 text-xs">
                {count} {t("layers.elements")}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive ? (
            <Eye className="w-4 h-4 text-white/80" />
          ) : (
            <EyeOff className="w-4 h-4 text-white/40" />
          )}
        </div>
      </button>
      {isActive && onOpacityChange && (
        <div className="mt-2 px-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs">
              {t("layers.opacity")}:
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => onOpacityChange(parseInt(e.target.value))}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            />
            <span className="text-white/70 text-xs font-medium w-9 text-right">
              {opacity}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerToggle;
