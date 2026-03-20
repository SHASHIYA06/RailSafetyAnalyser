interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  gradient: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ title, value, subtitle, icon, gradient, trend }: StatCardProps) {
  return (
    <div className={`stat-card rounded-2xl p-6 text-white card-hover cursor-default ${gradient} shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/70 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-semibold ${trend.value >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-white/50 text-xs">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
