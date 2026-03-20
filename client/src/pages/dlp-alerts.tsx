import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle, CheckCircle, XCircle, Bell, Loader2, Clock,
  ShieldAlert, Package, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";

const SEVERITY_CONFIG = {
  CRITICAL: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
  HIGH: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", icon: AlertTriangle },
  MEDIUM: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", icon: Bell },
  LOW: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: Bell },
};

const TYPE_ICONS: Record<string, any> = {
  STOCK: Package,
  SAFETY: ShieldAlert,
  MAINTENANCE: RefreshCw,
  SYSTEM: AlertTriangle,
};

export default function DlpAlertsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/dlp/alerts"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/alerts");
      return res.json();
    },
    staleTime: 20000,
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/dlp/alerts/${id}/resolve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to resolve alert");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/alerts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/stats"] });
      toast({ title: "Alert resolved", description: "The alert has been marked as resolved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to resolve alert.", variant: "destructive" });
    },
  });

  const alerts = data?.alerts || [];
  const active = alerts.filter((a: any) => !a.isResolved);
  const resolved = alerts.filter((a: any) => a.isResolved);
  const criticalCount = active.filter((a: any) => a.severity === "CRITICAL").length;

  return (
    <Layout
      title="Alerts & Notifications"
      subtitle="Manage stock alerts, maintenance warnings, and system notifications"
      actions={
        <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-2 h-9">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      }
    >
      <div className="p-4 md:p-6 space-y-5">

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Alerts", value: active.length, icon: Bell, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Critical", value: criticalCount, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
            { label: "High Priority", value: active.filter((a: any) => a.severity === "HIGH").length, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Resolved", value: resolved.length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
          </div>
        )}

        {/* Active Alerts */}
        {active.length > 0 && (
          <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <h3 className="font-bold text-foreground">Active Alerts ({active.length})</h3>
            </div>
            <div className="divide-y divide-border">
              {active.map((alert: any) => {
                const cfg = SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.LOW;
                const SeverityIcon = cfg.icon;
                const TypeIcon = TYPE_ICONS[alert.alertType] || AlertTriangle;
                return (
                  <div key={alert.id} className={`p-4 flex items-start gap-4 hover:bg-muted/5 transition-colors`}>
                    <div className={`w-10 h-10 ${cfg.bg} ${cfg.border} border rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <TypeIcon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-sm text-foreground">{alert.title}</div>
                          <div className="text-sm text-muted-foreground mt-0.5">{alert.description}</div>
                          {alert.itemPartNumber && (
                            <div className="text-xs text-muted-foreground/70 mt-1 font-mono">{alert.itemPartNumber}</div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            <SeverityIcon className="h-3 w-3" />
                            {alert.severity}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{alert.alertType}</span>
                        <Button
                          size="sm"
                          onClick={() => resolveMutation.mutate(alert.id)}
                          disabled={resolveMutation.isPending}
                          className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white gap-1"
                        >
                          {resolveMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!isLoading && active.length === 0 && (
          <div className="bg-white dark:bg-card rounded-2xl border border-green-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="font-bold text-foreground text-lg">All Clear!</div>
            <div className="text-sm text-muted-foreground mt-1">No active alerts at this time.</div>
          </div>
        )}

        {/* Resolved Alerts */}
        {resolved.length > 0 && (
          <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <h3 className="font-bold text-muted-foreground">Resolved ({resolved.length})</h3>
            </div>
            <div className="divide-y divide-border">
              {resolved.map((alert: any) => (
                <div key={alert.id} className="p-4 flex items-center gap-3 opacity-60">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground line-through">{alert.title}</div>
                    <div className="text-xs text-muted-foreground">{alert.description}</div>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">{new Date(alert.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
