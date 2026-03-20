import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownToLine, ArrowUpFromLine, RotateCcw, ArrowLeftRight,
  Search, Filter, Loader2, FileText, Clock, CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";

const TX_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: any }> = {
  RECEIPT: { label: "Receipt", color: "text-green-700", bg: "bg-green-50", border: "border-green-200", icon: ArrowDownToLine },
  ISSUE: { label: "Issue", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", icon: ArrowUpFromLine },
  RETURN: { label: "Return", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", icon: RotateCcw },
  TRANSFER: { label: "Transfer", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", icon: ArrowLeftRight },
  ADJUSTMENT: { label: "Adjustment", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", icon: Filter },
};

const REF_COLORS: Record<string, string> = {
  NCR: "bg-red-100 text-red-700",
  JOB_CARD: "bg-blue-100 text-blue-700",
  PO: "bg-green-100 text-green-700",
  OTHER: "bg-gray-100 text-gray-700",
};

export default function DlpTransactionsPage() {
  const [search, setSearch] = useState("");
  const [txType, setTxType] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["/api/dlp/transactions", { search, type: txType }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (txType !== "All") params.set("type", txType);
      const res = await fetch(`/api/dlp/transactions?${params}`);
      return res.json();
    },
    staleTime: 15000,
  });

  const transactions = data?.transactions || [];
  const receiptCount = transactions.filter((t: any) => t.transactionType === "RECEIPT").length;
  const issueCount = transactions.filter((t: any) => t.transactionType === "ISSUE").length;
  const returnCount = transactions.filter((t: any) => t.transactionType === "RETURN").length;

  return (
    <Layout
      title="Transaction Log"
      subtitle="Complete inventory movement history — receipts, issues, returns, transfers"
    >
      <div className="p-4 md:p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Transactions", value: transactions.length, color: "text-blue-600" },
            { label: "Receipts (In)", value: receiptCount, color: "text-green-600" },
            { label: "Issues (Out)", value: issueCount, color: "text-blue-600" },
            { label: "Returns", value: returnCount, color: "text-orange-600" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4">
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search item name, reference ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
            </div>
            <select value={txType} onChange={e => setTxType(e.target.value)} className="h-10 border border-border rounded-lg px-3 text-sm bg-background">
              <option value="All">All Types</option>
              {Object.entries(TX_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transaction Timeline */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mr-3" />
              <span className="text-muted-foreground">Loading transactions...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <div className="font-semibold text-foreground">No transactions found</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Item</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Qty</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase hidden md:table-cell">Movement</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase hidden lg:table-cell">Reference</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase hidden lg:table-cell">Remarks</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: any) => {
                    const cfg = TX_CONFIG[tx.transactionType] || TX_CONFIG.ISSUE;
                    const TxIcon = cfg.icon;
                    const refColor = REF_COLORS[tx.referenceType] || REF_COLORS.OTHER;
                    const date = new Date(tx.transactionDate);
                    return (
                      <tr key={tx.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            <TxIcon className="h-3.5 w-3.5" />
                            {cfg.label}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-sm text-foreground">{tx.itemName}</div>
                          {tx.partNumber && <div className="font-mono text-xs text-muted-foreground">{tx.partNumber}</div>}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-lg font-black ${tx.transactionType === "RECEIPT" ? "text-green-600" : tx.transactionType === "ISSUE" ? "text-blue-600" : "text-orange-600"}`}>
                            {tx.transactionType === "RECEIPT" ? "+" : tx.transactionType === "ISSUE" ? "-" : "↩"}{tx.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
                          {tx.fromLocation && <span>{tx.fromLocation}</span>}
                          {tx.fromLocation && tx.toLocation && <span className="mx-1">→</span>}
                          {tx.toLocation && <span>{tx.toLocation}</span>}
                          {!tx.fromLocation && !tx.toLocation && <span>—</span>}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          {tx.referenceType && (
                            <div>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${refColor}`}>{tx.referenceType}</span>
                              {tx.referenceId && <div className="text-xs text-muted-foreground mt-0.5">{tx.referenceId}</div>}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground max-w-[160px] truncate">
                          {tx.remarks || "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="flex items-center justify-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          <div>{date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                          <div>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
