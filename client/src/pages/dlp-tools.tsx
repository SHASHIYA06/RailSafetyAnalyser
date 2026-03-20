import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Wrench, Search, MapPin, AlertTriangle, CheckCircle, Calendar, Loader2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";

const CONDITION_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  Good: { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: CheckCircle },
  Faulty: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: AlertTriangle },
  Damaged: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: AlertTriangle },
};

const CATEGORY_COLORS: Record<string, string> = {
  Electrical: "bg-yellow-100 text-yellow-800",
  Mechanical: "bg-blue-100 text-blue-800",
  Measurement: "bg-purple-100 text-purple-800",
  Diagnostic: "bg-indigo-100 text-indigo-800",
  Inspection: "bg-cyan-100 text-cyan-800",
  Communication: "bg-green-100 text-green-800",
  Safety: "bg-red-100 text-red-800",
  Consumable: "bg-orange-100 text-orange-800",
  Precision: "bg-pink-100 text-pink-800",
};

export default function DlpToolsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [consumableFilter, setConsumableFilter] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/dlp/tools", { search, category, condition }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category !== "All") params.set("category", category);
      if (condition !== "All") params.set("condition", condition);
      const res = await fetch(`/api/dlp/tools?${params}`);
      return res.json();
    },
    staleTime: 30000,
  });

  const tools = data?.tools || [];
  const filtered = consumableFilter === "All" ? tools : tools.filter((t: any) => consumableFilter === "Consumable" ? t.consumable : !t.consumable);
  const categories = ["All", ...Array.from(new Set<string>(tools.map((t: any) => t.category)))];
  const totalQty = filtered.reduce((sum: number, t: any) => sum + (t.qty || 0), 0);
  const faultyCount = filtered.filter((t: any) => t.condition !== "Good").length;
  const consumableCount = filtered.filter((t: any) => t.consumable).length;
  const calibrationDue = filtered.filter((t: any) => t.calibrationDue).length;

  return (
    <Layout
      title="Tools Inventory"
      subtitle="115 tools & equipment across all storage locations — Almirah tracking & calibration"
    >
      <div className="p-4 md:p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Tools", value: filtered.length, sub: `${totalQty} units`, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Consumable Items", value: consumableCount, sub: "Need reorder tracking", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Calibration Items", value: calibrationDue, sub: "Scheduled calibration", color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Needs Attention", value: faultyCount, sub: "Faulty/Damaged", color: "text-red-600", bg: "bg-red-50" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm font-semibold text-foreground">{s.label}</div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search tool name or ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
            </div>
            <select value={category} onChange={e => setCategory(e.target.value)} className="h-10 border border-border rounded-lg px-3 text-sm bg-background">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={condition} onChange={e => setCondition(e.target.value)} className="h-10 border border-border rounded-lg px-3 text-sm bg-background">
              <option value="All">All Conditions</option>
              <option value="Good">Good</option>
              <option value="Faulty">Faulty</option>
              <option value="Damaged">Damaged</option>
            </select>
            <select value={consumableFilter} onChange={e => setConsumableFilter(e.target.value)} className="h-10 border border-border rounded-lg px-3 text-sm bg-background">
              <option value="All">All Types</option>
              <option value="Consumable">Consumable</option>
              <option value="Non-Consumable">Non-Consumable</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
            <span className="text-muted-foreground">Loading tools...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((tool: any) => {
              const cond = CONDITION_CONFIG[tool.condition] || CONDITION_CONFIG.Good;
              const CondIcon = cond.icon;
              const catColor = CATEGORY_COLORS[tool.category] || "bg-gray-100 text-gray-700";
              return (
                <div key={tool.id} className={`bg-white dark:bg-card rounded-2xl border shadow-sm p-4 ${tool.condition !== "Good" ? "border-red-200" : "border-border"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${catColor}`}>{tool.category}</span>
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cond.bg} ${cond.color}`}>
                      <CondIcon className="h-3 w-3" />
                      {tool.condition}
                    </div>
                  </div>
                  <div className="font-bold text-sm text-foreground leading-snug mb-1">{tool.toolName}</div>
                  <div className="font-mono text-xs text-muted-foreground mb-3">{tool.toolId}</div>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{tool.location || "—"}</span>
                    </div>
                    {tool.calibrationDue && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-purple-500" />
                        <span>Cal: {tool.calibrationDue}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>Qty: <span className="font-bold text-foreground">{tool.qty}</span></span>
                      </div>
                      {tool.consumable && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Consumable</span>
                      )}
                    </div>
                  </div>
                  {tool.remarks && (
                    <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground truncate">{tool.remarks}</div>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center">
                <Wrench className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <div className="font-semibold text-foreground">No tools found</div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
