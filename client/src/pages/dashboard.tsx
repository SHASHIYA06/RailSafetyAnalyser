import { useQuery } from "@tanstack/react-query";
import {
  Package, AlertTriangle, ArrowUpFromLine, ArrowDownToLine, TrendingUp,
  Wrench, Building2, Cpu, CheckCircle, Clock, Activity, Bell, Train
} from "lucide-react";
import Layout from "@/components/layout";
import { getUser } from "@/lib/auth";

const SYSTEM_HEALTH = [
  { name: "Brake System", status: "Critical", pct: 44, color: "bg-red-500" },
  { name: "Traction Motor", status: "Good", pct: 75, color: "bg-green-500" },
  { name: "Current Collector", status: "Good", pct: 69, color: "bg-green-500" },
  { name: "TMS", status: "Low", pct: 33, color: "bg-orange-500" },
  { name: "APS", status: "Good", pct: 80, color: "bg-green-500" },
  { name: "Lighting", status: "Good", pct: 80, color: "bg-green-500" },
  { name: "VAC System", status: "Good", pct: 100, color: "bg-green-500" },
];

export default function DashboardPage() {
  const user = getUser();

  const { data: statsData } = useQuery({
    queryKey: ["/api/dlp/stats"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/stats");
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: alertData } = useQuery({
    queryKey: ["/api/dlp/alerts"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/alerts");
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: txData } = useQuery({
    queryKey: ["/api/dlp/transactions", { limit: 5 }],
    queryFn: async () => {
      const res = await fetch("/api/dlp/transactions?limit=5");
      return res.json();
    },
    staleTime: 30000,
  });

  const stats = statsData || {};
  const alerts = alertData?.alerts || [];
  const recentTx = txData?.transactions?.slice(0, 5) || [];
  const activeAlerts = alerts.filter((a: any) => !a.isResolved);

  const alertSeverityConfig: Record<string, { color: string; bg: string }> = {
    critical: { color: "text-red-700", bg: "bg-red-50 border-red-200" },
    high: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
    medium: { color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  };

  return (
    <Layout title="Dashboard" subtitle={`Welcome back, ${user} — KMRCL DLP Store Management`}>
      <div className="p-4 md:p-6 space-y-6">

        {/* Hero Banner */}
        <div className="gradient-railway rounded-2xl p-5 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Train className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-xl font-black">Kolkata Metro Rail Corporation Ltd.</div>
                <div className="text-white/80 text-sm">DLP Store Inventory Management System · Depot Operations</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold">System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total DLP Items", value: stats.totalItems ?? 20, sub: "Across 14 systems", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Available Stock", value: stats.availableUnits ?? 97, sub: "Units in store", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Active Alerts", value: activeAlerts.length || 4, sub: "Need attention", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
            { label: "Tools Tracked", value: stats.totalTools ?? 39, sub: "Calibration managed", icon: Wrench, color: "text-purple-600", bg: "bg-purple-50" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-4 flex items-center gap-3">
                <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-6 w-6 ${s.color}`} />
                </div>
                <div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs font-semibold text-foreground">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* System Health */}
          <div className="lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-foreground">System Stock Health</h3>
            </div>
            <div className="space-y-4">
              {SYSTEM_HEALTH.map(sys => (
                <div key={sys.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{sys.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        sys.status === "Critical" ? "bg-red-50 text-red-600" :
                        sys.status === "Low" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                      }`}>{sys.status}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{sys.pct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all ${sys.color}`} style={{ width: `${sys.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-red-500" />
              <h3 className="font-bold text-foreground">Active Alerts</h3>
              {activeAlerts.length > 0 && (
                <span className="ml-auto text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                  {activeAlerts.length}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {activeAlerts.slice(0, 5).map((alert: any) => {
                const cfg = alertSeverityConfig[alert.severity] || alertSeverityConfig.medium;
                return (
                  <div key={alert.id} className={`rounded-xl border p-3 ${cfg.bg}`}>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                      <div>
                        <div className={`text-xs font-bold ${cfg.color}`}>{alert.itemName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{alert.message}</div>
                        <div className={`text-xs font-bold mt-1 ${cfg.color}`}>{alert.alertType?.replace("_", " ")}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {activeAlerts.length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-foreground">All Clear</div>
                  <div className="text-xs text-muted-foreground">No active alerts</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-foreground">Recent Transactions</h3>
            </div>
            <div className="space-y-1">
              {recentTx.map((tx: any) => {
                const isReceipt = tx.transactionType === "RECEIPT";
                return (
                  <div key={tx.id} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isReceipt ? "bg-green-50" : "bg-blue-50"}`}>
                      {isReceipt
                        ? <ArrowDownToLine className="h-4 w-4 text-green-600" />
                        : <ArrowUpFromLine className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{tx.itemName}</div>
                      <div className="text-xs text-muted-foreground">{tx.transactionType} · {tx.referenceId || "—"}</div>
                    </div>
                    <div className={`text-sm font-black flex-shrink-0 ${isReceipt ? "text-green-600" : "text-blue-600"}`}>
                      {isReceipt ? "+" : "-"}{tx.quantity}
                    </div>
                  </div>
                );
              })}
              {recentTx.length === 0 && (
                <div className="text-center py-6 text-sm text-muted-foreground">No transactions yet</div>
              )}
            </div>
          </div>

          {/* Vendor Summary */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-foreground">Top Vendors</h3>
            </div>
            <div className="space-y-1">
              {[
                { name: "M/s MELCO", items: 6, rating: "Excellent", flag: "🇮🇳", category: "Traction & TMS" },
                { name: "KBI Brake", items: 5, rating: "Excellent", flag: "🇮🇳", category: "Brake Systems" },
                { name: "Stemmann-Technic", items: 4, rating: "Excellent", flag: "🇩🇪", category: "Current Collector" },
                { name: "Faiveley", items: 4, rating: "Excellent", flag: "🇮🇳", category: "VAC & Coupler" },
                { name: "Tecknoware", items: 2, rating: "Good", flag: "🇮🇳", category: "Lighting" },
              ].map(v => (
                <div key={v.name} className="flex items-center gap-3 py-2.5 border-b border-border/50 last:border-0">
                  <div className="w-8 h-8 gradient-railway rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                    {v.flag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{v.category}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-foreground">{v.items} items</div>
                    <div className="text-xs text-green-600 font-semibold">{v.rating}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "14 Metro Train Systems", sub: "Traction to Fire Detection", color: "from-blue-500 to-blue-600" },
            { label: "10 Certified Vendors", sub: "India, Germany & France", color: "from-purple-500 to-purple-600" },
            { label: "115 Tools on Record", sub: "With calibration tracking", color: "from-green-500 to-green-600" },
            { label: "99.5% Target Uptime", sub: "DLP System Performance", color: "from-orange-500 to-orange-600" },
          ].map(s => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white`}>
              <div className="font-bold text-sm">{s.label}</div>
              <div className="text-white/70 text-xs mt-0.5">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
