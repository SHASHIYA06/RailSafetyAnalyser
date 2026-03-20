import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package, Plus, Edit, Trash2, Save, X, Search, CheckCircle,
  AlertTriangle, Loader2, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";

const CATEGORIES = ["Brake", "Traction", "Current_Collector", "APS", "TMS", "Lighting", "VAC", "Other"];
const SYSTEMS = ["Brake System", "Traction Motor & Inverter", "Current Collector", "APS", "TMS", "Lighting System", "VAC System", "PAPIS & CCTV System", "Battery System", "Coupler System", "Fire Detection System"];

function ItemForm({ item, onClose }: { item?: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    itemId: item?.itemId || "",
    partNumber: item?.partNumber || "",
    description: item?.description || "",
    category: item?.category || "Brake",
    systemType: item?.systemType || "Brake System",
    vendorName: item?.vendorName || "",
    unitOfMeasure: item?.unitOfMeasure || "Piece",
    receivedQty: item?.receivedQty || 0,
    consumedQty: item?.consumedQty || 0,
    availableQty: item?.availableQty || 0,
    recommendedQty: item?.recommendedQty || 10,
    reorderLevel: item?.reorderLevel || 5,
    status: item?.status || "ACTIVE",
    criticalFlag: item?.criticalFlag || false,
    notes: item?.notes || "",
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const url = item ? `/api/dlp/items/${item.id}` : "/api/dlp/items";
      const method = item ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/stats"] });
      toast({ title: item ? "Item updated!" : "Item added!", description: `${form.description} saved successfully.` });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save item.", variant: "destructive" });
    },
  });

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 gradient-railway rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-foreground">{item ? "Edit Item" : "Add New Item"}</div>
              <div className="text-xs text-muted-foreground">DLP Inventory Management</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Item ID *</label>
              <Input value={form.itemId} onChange={e => set("itemId", e.target.value)} placeholder="DLP-021" className="h-10" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Part Number *</label>
              <Input value={form.partNumber} onChange={e => set("partNumber", e.target.value)} placeholder="AB1234/56789" className="h-10" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Description *</label>
            <Input value={form.description} onChange={e => set("description", e.target.value)} placeholder="Item description" className="h-10" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Category</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-background">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">System</label>
              <select value={form.systemType} onChange={e => set("systemType", e.target.value)} className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-background">
                {SYSTEMS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Vendor Name</label>
              <Input value={form.vendorName} onChange={e => set("vendorName", e.target.value)} placeholder="Vendor name" className="h-10" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Unit of Measure</label>
              <select value={form.unitOfMeasure} onChange={e => set("unitOfMeasure", e.target.value)} className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-background">
                {["Piece", "Set", "Unit", "Meter", "Kg", "Liter", "Box", "Roll"].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Received Qty", field: "receivedQty", color: "text-blue-600" },
              { label: "Consumed Qty", field: "consumedQty", color: "text-orange-600" },
              { label: "Available Qty", field: "availableQty", color: "text-green-600" },
            ].map(f => (
              <div key={f.field}>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">{f.label}</label>
                <Input
                  type="number" min={0}
                  value={form[f.field as keyof typeof form] as number}
                  onChange={e => set(f.field, parseInt(e.target.value) || 0)}
                  className={`h-10 font-bold ${f.color}`}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Recommended Qty</label>
              <Input type="number" min={0} value={form.recommendedQty} onChange={e => set("recommendedQty", parseInt(e.target.value) || 0)} className="h-10" />
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Reorder Level</label>
              <Input type="number" min={0} value={form.reorderLevel} onChange={e => set("reorderLevel", parseInt(e.target.value) || 0)} className="h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)} className="w-full h-10 border border-border rounded-lg px-3 text-sm bg-background">
                <option value="ACTIVE">Active</option>
                <option value="CRITICAL">Critical</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.criticalFlag} onChange={e => set("criticalFlag", e.target.checked)} className="w-4 h-4 accent-red-500" />
                <span className="text-sm font-semibold text-red-600">Mark as Critical Item</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={2} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
          </div>
        </div>

        <div className="p-5 border-t border-border flex gap-3">
          <Button
            onClick={() => saveMutation.mutate(form)}
            disabled={saveMutation.isPending || !form.itemId || !form.partNumber || !form.description}
            className="flex-1 gradient-railway text-white border-0 gap-2"
          >
            {saveMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Saving...</> : <><Save className="h-4 w-4" />{item ? "Save Changes" : "Add Item"}</>}
          </Button>
          <Button variant="outline" onClick={onClose} className="px-6">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

export default function DlpItemManagerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/dlp/items", { search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/dlp/items?${params}`);
      return res.json();
    },
    staleTime: 15000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/dlp/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dlp/stats"] });
      toast({ title: "Item deleted", description: "Item removed from inventory." });
    },
  });

  const items = data?.items || [];

  return (
    <Layout
      title="Item Manager"
      subtitle="Add, edit, and manage DLP inventory items — full CRUD access"
      actions={
        <Button size="sm" onClick={() => setShowAddForm(true)} className="gradient-railway text-white border-0 gap-2 h-9">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      }
    >
      {(showAddForm || editItem) && (
        <ItemForm item={editItem || undefined} onClose={() => { setEditItem(null); setShowAddForm(false); }} />
      )}

      <div className="p-4 md:p-6 space-y-4">
        <div className="bg-white dark:bg-card rounded-2xl border border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Item / Part</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground uppercase hidden md:table-cell">System</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Received</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Consumed</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Available</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500 mx-auto" /></td></tr>
                )}
                {!isLoading && items.map((item: any) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {item.criticalFlag && <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                        <div>
                          <div className="font-semibold text-sm text-foreground">{item.description}</div>
                          <div className="text-xs text-muted-foreground font-mono">{item.itemId} · {item.partNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">{item.systemType}</td>
                    <td className="px-4 py-3 text-center font-bold text-sm text-blue-600">{item.receivedQty}</td>
                    <td className="px-4 py-3 text-center font-bold text-sm text-orange-600">{item.consumedQty}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-lg font-black ${item.availableQty <= item.reorderLevel ? "text-red-600" : "text-green-600"}`}>
                        {item.availableQty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditItem(item)} className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-muted-foreground">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { if (confirm(`Delete "${item.description}"?`)) deleteMutation.mutate(item.id); }}
                          className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-muted-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && items.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No items found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
