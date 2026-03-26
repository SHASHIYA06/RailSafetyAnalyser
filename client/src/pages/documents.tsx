import { useState } from "react";
import {
  FolderOpen, Upload, FileText, File,
  Search, Download, Trash2, Eye, Clock, CheckCircle,
  HardDrive, Database, Cloud
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout";

const MOCK_DOCS = [
  {
    id: 1, name: "EN 50126-1 RAMS Lifecycle Guide.pdf", type: "pdf", size: "4.2 MB",
    category: "Standards", status: "indexed", uploaded: "2 days ago", pages: 142,
    tags: ["EN 50126", "RAMS", "Lifecycle"]
  },
  {
    id: 2, name: "ETCS System Requirements Specification.pdf", type: "pdf", size: "8.7 MB",
    category: "Signaling", status: "indexed", uploaded: "3 days ago", pages: 312,
    tags: ["ETCS", "Signaling", "SIL 4"]
  },
  {
    id: 3, name: "Traction Motor RAMS Assessment Report.docx", type: "docx", size: "2.1 MB",
    category: "Reports", status: "indexed", uploaded: "5 days ago", pages: 68,
    tags: ["Traction", "Motor", "Assessment"]
  },
  {
    id: 4, name: "CBTC Technical Design Specification.pdf", type: "pdf", size: "12.4 MB",
    category: "Signaling", status: "processing", uploaded: "1 day ago", pages: 480,
    tags: ["CBTC", "Metro", "Design"]
  },
  {
    id: 5, name: "Safety Case - Platform Screen Doors.pdf", type: "pdf", size: "3.8 MB",
    category: "Safety Cases", status: "indexed", uploaded: "1 week ago", pages: 96,
    tags: ["Platform", "Safety Case", "EN 50126"]
  },
  {
    id: 6, name: "Component Supplier Qualification Matrix.xlsx", type: "xlsx", size: "1.2 MB",
    category: "Management", status: "indexed", uploaded: "1 week ago", pages: 0,
    tags: ["Suppliers", "Qualification", "Matrix"]
  },
  {
    id: 7, name: "Fire Protection EN 45545 Test Reports.pdf", type: "pdf", size: "5.6 MB",
    category: "Test Reports", status: "indexed", uploaded: "2 weeks ago", pages: 88,
    tags: ["EN 45545", "Fire", "Testing"]
  },
  {
    id: 8, name: "EMC Compliance Test Summary EN 50121.pdf", type: "pdf", size: "3.1 MB",
    category: "Test Reports", status: "pending", uploaded: "2 weeks ago", pages: 54,
    tags: ["EMC", "EN 50121", "Testing"]
  },
];

const DOC_CATEGORIES = ["All", "Standards", "Signaling", "Reports", "Safety Cases", "Test Reports", "Management"];

const FILE_ICONS: Record<string, any> = {
  pdf: FileText,
  docx: File,
  xlsx: Database,
  pptx: File,
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  indexed: { label: "Indexed", color: "text-green-600", icon: CheckCircle },
  processing: { label: "Processing", color: "text-blue-600", icon: Clock },
  pending: { label: "Pending", color: "text-orange-600", icon: Clock },
};

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isDragOver, setIsDragOver] = useState(false);

  const filtered = MOCK_DOCS.filter(doc => {
    const matchCat = selectedCategory === "All" || doc.category === selectedCategory;
    const matchSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const indexedCount = MOCK_DOCS.filter(d => d.status === "indexed").length;
  const totalSize = "41.1 MB";

  return (
    <Layout
      title="Document Management"
      subtitle="Upload and index RAMS documents, safety cases, and technical specifications"
      actions={
        <Button size="sm" className="gradient-railway text-white border-0 shadow-sm gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Documents", value: MOCK_DOCS.length, icon: FolderOpen, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Indexed", value: indexedCount, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Size", value: totalSize, icon: HardDrive, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Storage Used", value: "82%", icon: Cloud, color: "text-orange-600", bg: "bg-orange-50" },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4 flex items-center gap-3 shadow-sm">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Area + Filters */}
          <div className="space-y-4">
            {/* Upload Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragOver
                  ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                  : "border-border hover:border-blue-300 hover:bg-muted/30"
              }`}
            >
              <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <div className="text-sm font-semibold text-foreground mb-1">Drop files here</div>
              <div className="text-xs text-muted-foreground mb-4">PDF, DOCX, XLSX, PPTX supported</div>
              <Button size="sm" variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Browse Files
              </Button>
            </div>

            {/* Category Filter */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold">Filter by Category</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-1">
                {DOC_CATEGORIES.map(cat => {
                  const count = cat === "All" ? MOCK_DOCS.length : MOCK_DOCS.filter(d => d.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat
                          ? "bg-railway-blue text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        selectedCategory === cat ? 'bg-white/20' : 'bg-muted'
                      }`}>{count}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Google Drive Integration */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center">
                    <Cloud className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">Google Drive</div>
                    <div className="text-xs text-muted-foreground">Sync RAMS documents</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Connect your Google Drive folder to automatically sync and index railway documents.
                </p>
                <Button size="sm" className="w-full gap-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Cloud className="h-4 w-4" />
                  Connect Drive
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Document List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search documents by name or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white dark:bg-card border-border text-sm"
              />
            </div>

            {/* Count */}
            <div className="text-xs text-muted-foreground font-medium">
              Showing <span className="text-foreground font-bold">{filtered.length}</span> of {MOCK_DOCS.length} documents
            </div>

            {/* Documents */}
            <div className="space-y-2">
              {filtered.map(doc => {
                const Icon = FILE_ICONS[doc.type] || File;
                const statusConf = STATUS_CONFIG[doc.status];
                const StatusIcon = statusConf.icon;
                const iconColor = doc.type === 'pdf' ? 'text-red-600 bg-red-50' : doc.type === 'xlsx' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50';

                return (
                  <div key={doc.id} className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-4 card-hover">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="text-sm font-semibold text-foreground leading-tight truncate">{doc.name}</h4>
                          <div className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${statusConf.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConf.label}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          <span>{doc.size}</span>
                          {doc.pages > 0 && <span>{doc.pages} pages</span>}
                          <span>{doc.uploaded}</span>
                          <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {doc.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
