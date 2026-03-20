import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  ArrowUpFromLine, ArrowDownToLine, RotateCcw, Save, X,
  Package, CheckCircle, AlertTriangle, Loader2, Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";

const TX_TYPES = [
  { value: "ISSUE", label: "Issue (Out)", icon: ArrowUpFromLine, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { value: "RECEIPT", label: "Receipt (In)", icon: ArrowDownToLine, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  { value: "RETURN", label: "Return", icon: RotateCcw, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
];

const REF_TYPES = ["JOB_CARD", "NCR", "PO", "TRANSFER", "OTHER"];

export default function DlpIssueFormPage() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [txType, setTxType] = useState("ISSUE");
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [fromLocation, setFromLocation] = useState("Central Store");
  const [toLocation, setToLocation] = useState("");
  const [refType, setRefType] = useState("JOB_CARD");
  const [refId, setRefId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [showItemSearch, setShowItemSearch] = useState(false);

  const { data: itemsData } = useQuery({
    queryKey: ["/api/dlp/items", { search: itemSearch }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (itemSearch) params.set("search", itemSearch);
      const res = await fetch(`/api/dlp/items?${params}`);
      return res.json();
    },
    staleTime: 10000,
  });

  const items = itemsData?.items || [];

  const createTransaction = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/dlp/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create transaction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/stats"] });
      toast({ title: "Transaction recorded!", description: `${txType} transaction created successfully.` });
      setLocation("/transactions");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create transaction.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) { toast({ title: "Select an item", description: "Please choose an inventory item.", variant: "destructive" }); return; }
    if (quantity <= 0) { toast({ title: "Invalid quantity", description: "Quantity must be at least 1.", variant: "destructive" }); return; }

    createTransaction.mutate({
      transactionType: txType,
      itemId: selectedItem.id,
      itemName: selectedItem.description,
      partNumber: selectedItem.partNumber,
      quantity,
      fromLocation: txType === "RECEIPT" ? "" : fromLocation,
      toLocation: txType === "ISSUE" ? toLocation : txType === "RECEIPT" ? "Central Store" : fromLocation,
      referenceType: refType,
      referenceId: refId,
      remarks,
      initiatedBy: localStorage.getItem("dlp_user") || "Admin",
      status: "COMPLETED",
    });
  };

  const selectedType = TX_TYPES.find(t => t.value === txType)!;
  const TxIcon = selectedType.icon;

  return (
    <Layout
      title="New Transaction"
      subtitle="Record stock issue, receipt, or return — with full audit trail"
      actions={
        <Button variant="outline" size="sm" onClick={() => setLocation("/transactions")} className="gap-2 h-9">
          <X className="h-4 w-4" /> Cancel
        </Button>
      }
    >
      <div className="p-4 md:p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Transaction Type */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Transaction Type</div>
            <div className="grid grid-cols-3 gap-3">
              {TX_TYPES.map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTxType(t.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${txType === t.value ? t.bg + " " + t.color + " border-current" : "border-border text-muted-foreground hover:bg-muted"}`}
                  >
                    <Icon className="h-5 w-5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Item Selection */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Select Item</div>
            {selectedItem ? (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-foreground">{selectedItem.description}</div>
                  <div className="text-xs text-muted-foreground">{selectedItem.partNumber} · Available: <span className="font-bold text-green-600">{selectedItem.availableQty}</span> {selectedItem.unitOfMeasure}</div>
                </div>
                <button type="button" onClick={() => { setSelectedItem(null); setItemSearch(""); }} className="text-muted-foreground hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search item by name or part number..."
                  value={itemSearch}
                  onChange={e => { setItemSearch(e.target.value); setShowItemSearch(true); }}
                  onFocus={() => setShowItemSearch(true)}
                  className="pl-9 h-11"
                />
                {showItemSearch && items.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 bg-white border border-border rounded-xl shadow-2xl mt-1 max-h-60 overflow-y-auto">
                    {items.slice(0, 10).map((item: any) => (
                      <button
                        key={item.id}
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left border-b border-border/50 last:border-0"
                        onClick={() => { setSelectedItem(item); setItemSearch(item.description); setShowItemSearch(false); }}
                      >
                        <Package className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">{item.description}</div>
                          <div className="text-xs text-muted-foreground">{item.partNumber} · Stock: {item.availableQty}</div>
                        </div>
                        {item.criticalFlag && <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transaction Details */}
          <div className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm space-y-4">
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Transaction Details</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Quantity *</label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                  className="h-11"
                />
                {selectedItem && txType === "ISSUE" && quantity > selectedItem.availableQty && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Exceeds available stock ({selectedItem.availableQty})
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Reference Type</label>
                <select value={refType} onChange={e => setRefType(e.target.value)} className="w-full h-11 border border-border rounded-lg px-3 text-sm bg-background">
                  {REF_TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Reference ID (e.g. JC-2026-001)</label>
              <Input placeholder="Enter job card, NCR, or PO number" value={refId} onChange={e => setRefId(e.target.value)} className="h-11" />
            </div>

            {txType !== "RECEIPT" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">From Location</label>
                <Input placeholder="e.g. Central Store" value={fromLocation} onChange={e => setFromLocation(e.target.value)} className="h-11" />
              </div>
            )}

            {txType !== "RETURN" && (
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{txType === "RECEIPT" ? "To Location" : "To Location (Workshop/Area)"}</label>
                <Input placeholder={txType === "RECEIPT" ? "Central Store" : "e.g. Workshop, Maintenance Bay TS#05"} value={toLocation} onChange={e => setToLocation(e.target.value)} className="h-11" />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Remarks</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="Additional notes about this transaction..."
                rows={2}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!selectedItem || createTransaction.isPending || (txType === "ISSUE" && quantity > (selectedItem?.availableQty || 0))}
              className="flex-1 h-12 gradient-railway text-white border-0 font-bold gap-2"
            >
              {createTransaction.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" />Saving...</>
              ) : (
                <><TxIcon className="h-4 w-4" />Record {selectedType.label}</>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setLocation("/transactions")} className="h-12 px-6">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
