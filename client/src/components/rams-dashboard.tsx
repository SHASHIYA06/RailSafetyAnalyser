import { CheckCircle, Clock, Shield, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const ramsMetrics = [
    {
      title: "Reliability",
      value: stats ? Math.round(stats.averageRAMSScore * 0.97) : 94,
      icon: CheckCircle,
      color: "success-green"
    },
    {
      title: "Availability", 
      value: stats ? Math.round(stats.averageRAMSScore * 0.99) : 98,
      icon: TrendingUp,
      color: "railway-blue"
    },
    {
      title: "Maintainability",
      value: stats ? Math.round(stats.averageRAMSScore * 0.89) : 87,
      icon: Clock,
      color: "warning-orange"
    },
    {
      title: "Safety (SIL)",
      value: stats ? `SIL ${Math.min(4, Math.floor(stats.averageRAMSScore / 25) + 1)}` : "SIL 3",
      icon: Shield,
      color: "danger-red"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {ramsMetrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof metric.value === 'string' ? metric.value : `${metric.value}%`}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'success-green' ? 'bg-green-100' :
                  metric.color === 'railway-blue' ? 'bg-blue-100' :
                  metric.color === 'warning-orange' ? 'bg-orange-100' :
                  metric.color === 'danger-red' ? 'bg-red-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    metric.color === 'success-green' ? 'text-success-green' :
                    metric.color === 'railway-blue' ? 'text-railway-blue' :
                    metric.color === 'warning-orange' ? 'text-warning-orange' :
                    metric.color === 'danger-red' ? 'text-danger-red' : 'text-gray-600'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
