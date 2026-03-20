import { useQuery } from "@tanstack/react-query";
import { Cpu, AlertTriangle, CheckCircle, TrendingDown, Activity, Loader2 } from "lucide-react";
import Layout from "@/components/layout";

const FREQ_CONFIG: Record<string, { color: string; bg: string }> = {
  High: { color: "text-red-600", bg: "bg-red-50" },
  Medium: { color: "text-orange-600", bg: "bg-orange-50" },
  Low: { color: "text-green-600", bg: "bg-green-50" },
};

const SYSTEM_ICONS = ["⚡", "🛑", "🔋", "🖥️", "💡", "📡", "🌬️", "📷", "🚪", "🔌", "🔗", "🔥", "🔌", "🎛️"];

export default function DlpSystemsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/dlp/systems"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/systems");
      return res.json();
    },
    staleTime: 60000,
  });

  const systems = data?.systems || [];
  const criticalSystems = systems.filter((s: any) => s.criticalStatus);
  const totalItems = systems.reduce((sum: number, s: any) => sum + (s.totalItems || 0), 0);
  const totalAvailable = systems.reduce((sum: number, s: any) => sum + (s.totalAvailable || 0), 0);

  return (
    <Layout
      title="Train Systems"
      subtitle="14 metro train subsystems — Parts inventory status by system"
    >
      <div className="p-4 md:p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Systems", value: systems.length, color: "text-blue-600" },
            { label: "Critical Systems", value: criticalSystems.length, color: "text-red-600" },
            { label: "Total Part Types", value: totalItems, color: "text-purple-600" },
            { label: "Available Units", value: totalAvailable, color: "text-green-600" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
            <span className="text-muted-foreground">Loading systems...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systems.map((sys: any, idx: number) => {
              const freq = FREQ_CONFIG[sys.maintenanceFrequency] || FREQ_CONFIG.Low;
              const consumptionRate = sys.totalReceived > 0 ? Math.round((sys.totalConsumed / sys.totalReceived) * 100) : 0;
              return (
                <div key={sys.id} className={`bg-white dark:bg-card rounded-2xl border shadow-sm p-5 hover:shadow-md transition-all ${sys.criticalStatus ? "border-red-200" : "border-border"}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${sys.criticalStatus ? "bg-red-50" : "bg-blue-50"}`}>
                      {SYSTEM_ICONS[idx] || "⚙️"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-muted-foreground">{sys.systemId}</span>
                        {sys.criticalStatus && (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="h-3 w-3" />
                            Critical
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-foreground text-base mt-0.5 leading-tight">{sys.systemName}</div>
                      <div className="text-xs text-muted-foreground mt-1">Primary Vendor: <span className="font-semibold text-foreground">{sys.primaryVendor}</span></div>
                    </div>
                  </div>

                  {/* Stock Bar */}
                  {sys.totalReceived > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Consumption Rate</span>
                        <span className="font-bold text-foreground">{consumptionRate}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${consumptionRate > 70 ? "bg-red-500" : consumptionRate > 40 ? "bg-orange-500" : "bg-green-500"}`}
                          style={{ width: `${consumptionRate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Items", value: sys.totalItems, color: "text-blue-600" },
                      { label: "Received", value: sys.totalReceived, color: "text-foreground" },
                      { label: "Consumed", value: sys.totalConsumed, color: "text-orange-600" },
                      { label: "Available", value: sys.totalAvailable, color: sys.totalAvailable === 0 ? "text-red-600 font-black" : "text-green-600" },
                    ].map(s => (
                      <div key={s.label} className="bg-muted/30 rounded-xl py-2">
                        <div className={`text-lg font-black ${s.color}`}>{s.value}</div>
                        <div className="text-xs text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${freq.bg} ${freq.color}`}>
                      <Activity className="h-3 w-3" />
                      {sys.maintenanceFrequency} Maintenance
                    </div>
                    {sys.totalAvailable === 0 && sys.totalItems > 0 && (
                      <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <TrendingDown className="h-3.5 w-3.5" />
                        No Stock
                      </span>
                    )}
                    {sys.totalAvailable > 0 && (
                      <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Stock OK
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
