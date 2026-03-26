import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3, Download, TrendingUp, TrendingDown, Package, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316"];

function exportToCSV(data: any[], filename: string) {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const header = keys.join(",");
  const rows = data.map(row => keys.map(k => `"${String(row[k] ?? "").replace(/"/g, '""')}"`).join(","));
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DlpReportsPage() {
  const { data: itemsData, isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/dlp/items"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/items");
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: systemsData } = useQuery({
    queryKey: ["/api/dlp/systems"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/systems");
      return res.json();
    },
    staleTime: 60000,
  });

  const { data: txData } = useQuery({
    queryKey: ["/api/dlp/transactions"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/transactions");
      return res.json();
    },
    staleTime: 30000,
  });

  const { data: vendorsData } = useQuery({
    queryKey: ["/api/dlp/vendors"],
    queryFn: async () => {
      const res = await fetch("/api/dlp/vendors");
      return res.json();
    },
    staleTime: 60000,
  });

  const items = itemsData?.items || [];
  const systems = systemsData?.systems || [];
  const transactions = txData?.transactions || [];
  const vendors = vendorsData?.vendors || [];

  const totalReceived = items.reduce((s: number, i: any) => s + (i.receivedQty || 0), 0);
  const totalConsumed = items.reduce((s: number, i: any) => s + (i.consumedQty || 0), 0);
  const totalAvailable = items.reduce((s: number, i: any) => s + (i.availableQty || 0), 0);
  const criticalItems = items.filter((i: any) => i.criticalFlag && i.availableQty <= i.reorderLevel);

  const categoryAccumulator: Record<string, { received: number; consumed: number; available: number }> = items.reduce((m: Record<string, { received: number; consumed: number; available: number }>, i: any) => {
    const c = i.category || "Other";
    if (!m[c]) m[c] = { received: 0, consumed: 0, available: 0 };
    m[c].received += i.receivedQty || 0;
    m[c].consumed += i.consumedQty || 0;
    m[c].available += i.availableQty || 0;
    return m;
  }, {});
  const categoryData = Object.entries(categoryAccumulator).map(([name, vals]) => ({ name, ...vals }));

  const txTypePie = [
    { name: "Receipts", value: transactions.filter((t: any) => t.transactionType === "RECEIPT").length },
    { name: "Issues", value: transactions.filter((t: any) => t.transactionType === "ISSUE").length },
    { name: "Returns", value: transactions.filter((t: any) => t.transactionType === "RETURN").length },
  ].filter(d => d.value > 0);

  const systemChartData = systems.slice(0, 8).map((s: any) => ({
    name: s.systemName.split(" ").slice(0, 2).join(" "),
    received: s.totalReceived,
    consumed: s.totalConsumed,
    available: s.totalAvailable,
  }));

  return (
    <Layout
      title="Reports & Analytics"
      subtitle="Comprehensive inventory analysis — stock trends, consumption, system health"
      actions={
        <Button
          size="sm"
          onClick={() => exportToCSV(items.map((i: any) => ({
            "Item ID": i.itemId, "Part Number": i.partNumber, "Description": i.description,
            "Category": i.category, "System": i.systemType, "Vendor": i.vendorName,
            "Received": i.receivedQty, "Consumed": i.consumedQty, "Available": i.availableQty,
            "Reorder Level": i.reorderLevel, "Status": i.status, "Critical": i.criticalFlag ? "Yes" : "No",
          })), "KMRCL_DLP_Inventory_Report.csv")}
          className="gradient-railway text-white border-0 gap-2 h-9"
        >
          <Download className="h-4 w-4" />
          Export Inventory CSV
        </Button>
      }
    >
      <div className="p-4 md:p-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Received", value: totalReceived, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Consumed", value: totalConsumed, icon: TrendingDown, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Total Available", value: totalAvailable, icon: Package, color: "text-green-600", bg: "bg-green-50" },
            { label: "Critical Items", value: criticalItems.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
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

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Category Stock Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-foreground">Stock by Category</h3>
            </div>
            {itemsLoading ? (
              <div className="flex items-center justify-center h-48"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                  <Bar dataKey="received" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Received" />
                  <Bar dataKey="consumed" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Consumed" />
                  <Bar dataKey="available" fill="#10B981" radius={[4, 4, 0, 0]} name="Available" />
                </BarChart>
              </ResponsiveContainer>
            )}
            <div className="flex items-center gap-4 mt-3 justify-center">
              {[{ color: "#3B82F6", label: "Received" }, { color: "#F59E0B", label: "Consumed" }, { color: "#10B981", label: "Available" }].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Pie */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="font-bold text-foreground mb-5">Transaction Breakdown</div>
            {txTypePie.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={txTypePie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {txTypePie.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">No transaction data</div>
            )}
          </div>
        </div>

        {/* System Stock Chart */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm">
          <h3 className="font-bold text-foreground mb-5">System-wise Stock Analysis (Top 8)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={systemChartData} margin={{ top: 0, right: 0, left: -20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="received" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Received" />
              <Bar dataKey="consumed" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Consumed" />
              <Bar dataKey="available" fill="#10B981" radius={[4, 4, 0, 0]} name="Available" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Items Table */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-foreground">Items At or Below Reorder Level</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => exportToCSV(transactions.map((t: any) => ({
                "Type": t.transactionType, "Item": t.itemName, "Part No.": t.partNumber,
                "Qty": t.quantity, "From": t.fromLocation, "To": t.toLocation,
                "Ref Type": t.referenceType, "Ref ID": t.referenceId, "Remarks": t.remarks,
                "Date": new Date(t.transactionDate).toLocaleDateString()
              })), "KMRCL_DLP_Transactions.csv")}
              className="gap-2 h-8 text-xs"
            >
              <Download className="h-3.5 w-3.5" /> Export Transactions
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">System</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Available</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Reorder Level</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Gap</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Vendor</th>
                </tr>
              </thead>
              <tbody>
                {items.filter((i: any) => i.availableQty <= i.reorderLevel).map((item: any) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {item.criticalFlag && <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                        <div>
                          <div className="font-semibold text-sm text-foreground">{item.description}</div>
                          <div className="text-xs text-muted-foreground">{item.partNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.systemType}</td>
                    <td className="px-4 py-3 text-center font-black text-lg text-red-600">{item.availableQty}</td>
                    <td className="px-4 py-3 text-center text-sm font-semibold text-foreground">{item.reorderLevel}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                        -{item.reorderLevel - item.availableQty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.vendorName}</td>
                  </tr>
                ))}
                {items.filter((i: any) => i.availableQty <= i.reorderLevel).length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">All items are above reorder level</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
