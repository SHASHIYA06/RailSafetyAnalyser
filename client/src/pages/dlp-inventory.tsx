import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package, Search, Filter, Plus, AlertTriangle, CheckCircle, Clock,
  Download, RefreshCw, ChevronDown, Eye, Edit, Loader2, X, TrendingDown, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  ACTIVE: { color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
  CRITICAL: { color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  LOW_STOCK: { color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  OUT_OF_STOCK: { color: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" },
};

const CATEGORIES = ["All", "Brake", "Traction", "Current_Collector", "APS", "TMS", "Lighting", "VAC"];

function ItemDetailModal({ item, onClose }: { item: any; onClose: () => void }) {
  const pct = item.recommendedQty > 0 ? Math.min(100, Math.round((item.availableQty / item.recommendedQty) * 100)) : 0;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className={`p-5 ${item.criticalFlag ? "bg-red-50 border-b border-red-100" : "bg-blue-50 border-b border-blue-100"}`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.itemId}</div>
              <div className="font-bold text-foreground text-lg leading-tight">{item.description}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.partNumber}</div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors ml-4">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Received", value: item.receivedQty, color: "text-blue-600" },
              { label: "Consumed", value: item.consumedQty, color: "text-orange-600" },
              { label: "Available", value: item.availableQty, color: item.availableQty <= item.reorderLevel ? "text-red-600 font-black" : "text-green-600" },
            ].map(s => (
              <div key={s.label} className="bg-muted/40 rounded-xl p-3 text-center">
                <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span>Stock Level vs Recommended ({item.recommendedQty})</span>
              <span className={pct < 50 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>{pct}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className={`h-2.5 rounded-full transition-all ${pct < 30 ? "bg-red-500" : pct < 60 ? "bg-orange-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Category:</span> <span className="font-semibold ml-1">{item.category}</span></div>
            <div><span className="text-muted-foreground">System:</span> <span className="font-semibold ml-1">{item.systemType}</span></div>
            <div><span className="text-muted-foreground">Vendor:</span> <span className="font-semibold ml-1">{item.vendorName}</span></div>
            <div><span className="text-muted-foreground">UOM:</span> <span className="font-semibold ml-1">{item.unitOfMeasure}</span></div>
            <div><span className="text-muted-foreground">Reorder Level:</span> <span className="font-semibold ml-1">{item.reorderLevel}</span></div>
            <div><span className="text-muted-foreground">Critical:</span> <span className={`font-semibold ml-1 ${item.criticalFlag ? "text-red-600" : "text-green-600"}`}>{item.criticalFlag ? "Yes" : "No"}</span></div>
          </div>
          {item.notes && (
            <div className="bg-muted/30 rounded-xl p-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Notes: </span>{item.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DlpInventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewItem, setViewItem] = useState<any>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/dlp/items", { search, category, status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      if (statusFilter !== "All") params.set("status", statusFilter);
      const res = await fetch(`/api/dlp/items?${params}`);
      return res.json();
    },
    staleTime: 30000,
  });

  const items = data?.items || [];
  const total = data?.total || 0;
  const lowStockCount = items.filter((i: any) => i.availableQty <= i.reorderLevel).length;
  const criticalCount = items.filter((i: any) => i.criticalFlag && i.availableQty <= i.reorderLevel).length;

  const getItemStatus = (item: any) => {
    if (item.availableQty === 0) return "OUT_OF_STOCK";
    if (item.criticalFlag && item.availableQty <= item.reorderLevel) return "CRITICAL";
    if (item.availableQty <= item.reorderLevel) return "LOW_STOCK";
    return "ACTIVE";
  };

  return (
    <Layout
      title="DLP Inventory"
      subtitle="Depot Level Parts — Real-time stock tracking for all 14 metro train systems"
      actions={
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()} className="gap-2 h-9">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" className="gradient-railway text-white border-0 gap-2 h-9">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      }
    >
      {viewItem && <ItemDetailModal item={viewItem} onClose={() => setViewItem(null)} />}
      <div className="p-4 md:p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Items", value: total, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Available Items", value: items.filter((i: any) => i.availableQty > i.reorderLevel).length, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Low Stock", value: lowStockCount, icon: TrendingDown, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Critical Alerts", value: criticalCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
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

        {/* Filters */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by part number, description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="h-10 border border-border rounded-lg px-3 text-sm bg-background">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="h-10 border border-border rounded-lg px-3 text-sm bg-background">
              <option value="All">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Item ID / Part No.</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">System</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Received</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Consumed</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Available</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Vendor</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                    <div className="text-sm text-muted-foreground">Loading inventory...</div>
                  </td></tr>
                )}
                {!isLoading && items.length === 0 && (
                  <tr><td colSpan={9} className="py-16 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                    <div className="font-semibold text-foreground">No items found</div>
                  </td></tr>
                )}
                {!isLoading && items.map((item: any) => {
                  const status = getItemStatus(item);
                  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.ACTIVE;
                  const isLow = item.availableQty <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs font-bold text-blue-600">{item.itemId}</div>
                        <div className="text-xs text-muted-foreground">{item.partNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                          {item.criticalFlag && <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                          {item.description}
                        </div>
                        <div className="text-xs text-muted-foreground">{item.category} · {item.unitOfMeasure}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-xs text-muted-foreground max-w-[140px] truncate">{item.systemType}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-sm text-foreground">{item.receivedQty}</td>
                      <td className="px-4 py-3 text-center font-bold text-sm text-orange-600">{item.consumedQty}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-lg font-black ${isLow ? "text-red-600" : "text-green-600"}`}>{item.availableQty}</span>
                        {isLow && <div className="text-xs text-red-500">Min: {item.reorderLevel}</div>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="text-xs text-muted-foreground">{item.vendorName}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                          {status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setViewItem(item)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!isLoading && items.length > 0 && (
            <div className="px-4 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground">
              Showing {items.length} of {total} items
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
