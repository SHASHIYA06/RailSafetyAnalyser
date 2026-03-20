import { CheckCircle, Clock, Shield, TrendingUp } from "lucide-react";

interface RAMSDashboardProps {
  stats?: {
    totalComponents: number;
    totalStandards: number;
    certifiedSuppliers: number;
    averageRAMSScore: number;
    complianceRate: number;
  };
}

export default function RAMSDashboard({ stats }: RAMSDashboardProps) {
  const metrics = [
    {
      title: "Reliability",
      value: stats ? Math.round(stats.averageRAMSScore * 0.97) : 94,
      icon: CheckCircle,
      color: "#16a34a",
    },
    {
      title: "Availability",
      value: stats ? Math.round(stats.averageRAMSScore * 0.99) : 98,
      icon: TrendingUp,
      color: "#2563eb",
    },
    {
      title: "Maintainability",
      value: stats ? Math.round(stats.averageRAMSScore * 0.89) : 87,
      icon: Clock,
      color: "#d97706",
    },
    {
      title: "Safety",
      value: stats ? Math.round(stats.averageRAMSScore * 0.96) : 96,
      icon: Shield,
      color: "#dc2626",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="bg-white dark:bg-card rounded-xl border border-border p-4 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-1">{metric.title}</p>
              <p className="text-2xl font-bold" style={{ color: metric.color }}>
                {metric.value}%
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${metric.color}15` }}
            >
              <Icon className="h-5 w-5" style={{ color: metric.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
