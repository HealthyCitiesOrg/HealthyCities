const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, trendIcon: TrendIcon, trendColor, action, actionColor = 'text-blue-400' }) => (
  <div className="group relative bg-white/10 backdrop-blur-xl shadow-lg p-4 border border-white/20 rounded-xl transition-all duration-200 hover:shadow-xl hover:border-white/30">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-medium text-white/90 text-xs">{title}</h3>
        </div>
        <div className="space-y-1.5">
          <p className="font-bold text-white text-xl">{value}</p>
          <p className="text-white/50 text-xs">{subtitle}</p>
          {action && (
            <div className={`text-xs ${actionColor} bg-white/5 p-2 rounded-lg border border-white/10 mt-2 leading-relaxed`}>
              💡 {action}
            </div>
          )}
        </div>
      </div>
      {trend && TrendIcon && (
        <div className={`flex items-center gap-1 ${trendColor || 'text-white/70'} text-xs font-medium`}>
          <TrendIcon className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
