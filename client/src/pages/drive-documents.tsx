import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Cloud, RefreshCw, ExternalLink, Search, FileText, FileSpreadsheet,
  Presentation, Eye, Download, Folder, AlertCircle, CheckCircle, Loader2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout";

const MIME_ICONS: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  "application/pdf": { icon: FileText, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20", label: "PDF" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon: Presentation, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20", label: "PPTX" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20", label: "DOCX" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20", label: "XLSX" },
  "application/vnd.google-apps.document": { icon: FileText, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20", label: "Google Doc" },
  "application/vnd.google-apps.presentation": { icon: Presentation, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20", label: "Google Slides" },
  "application/vnd.google-apps.spreadsheet": { icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20", label: "Google Sheet" },
};

const getFileInfo = (mimeType: string) => MIME_ICONS[mimeType] || { icon: FileText, color: "text-gray-600", bg: "bg-gray-50", label: "File" };

const formatFileSize = (bytes: string | number) => {
  const n = parseInt(String(bytes || "0"));
  if (!n) return "—";
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

const FOLDER_URL = "https://drive.google.com/drive/folders/1O444fl8fyyf8B0LtVm99FLYvjBtx_TU0";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  webViewLink: string;
  category?: string;
}

interface DocViewerProps {
  file: DriveFile;
  onClose: () => void;
}

function DocViewer({ file, onClose }: DocViewerProps) {
  const fileInfo = getFileInfo(file.mimeType);
  const Icon = fileInfo.icon;

  // Build best viewer URL
  const getViewerUrl = () => {
    // For Google Docs formats, use the webViewLink
    if (file.mimeType.startsWith("application/vnd.google-apps.")) {
      return file.webViewLink;
    }
    // For PDFs and Office docs from Drive, use Google Docs Viewer
    if (file.id && !file.id.startsWith("mock_")) {
      return `https://drive.google.com/file/d/${file.id}/preview`;
    }
    // Fallback: open the Drive folder
    return FOLDER_URL;
  };

  const viewerUrl = getViewerUrl();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/30">
          <div className={`w-9 h-9 ${fileInfo.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <Icon className={`h-4 w-4 ${fileInfo.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-foreground text-sm truncate">{file.name}</div>
            <div className="text-xs text-muted-foreground">{fileInfo.label} · {formatFileSize(file.size)} · Modified {formatDate(file.modifiedTime)}</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a href={FOLDER_URL} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-2 h-8">
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Drive
              </Button>
            </a>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
        <div className="flex-1 relative">
          {viewerUrl === FOLDER_URL ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className={`w-16 h-16 ${fileInfo.bg} rounded-2xl flex items-center justify-center`}>
                <Icon className={`h-8 w-8 ${fileInfo.color}`} />
              </div>
              <div>
                <div className="font-semibold text-foreground mb-1">{file.name}</div>
                <div className="text-sm text-muted-foreground mb-6">This document is stored in your Google Drive RAMS folder. Click below to open it directly in Google Drive.</div>
              </div>
              <a href={FOLDER_URL} target="_blank" rel="noopener noreferrer">
                <Button className="gradient-railway text-white border-0 gap-2">
                  <Cloud className="h-4 w-4" />
                  Open Google Drive Folder
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          ) : (
            <iframe
              src={viewerUrl}
              className="w-full h-full border-0"
              title={file.name}
              allow="autoplay"
            />
          )}
        </div>
      </div>
    </div>
  );
}

const CATEGORY_FILTERS = ["All", "RAMS Standards", "Signaling Safety", "ETCS/Signaling", "CBTC Systems", "Safety Analysis", "Software Standards", "Fire Protection", "RAMS Tools", "Component Reports", "EMC Testing", "Safety Cases", "Cybersecurity"];

export default function DriveDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewingFile, setViewingFile] = useState<DriveFile | null>(null);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/drive/files"],
    queryFn: async () => {
      const res = await fetch("/api/drive/files");
      return res.json();
    },
    staleTime: 5 * 60 * 1000
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/drive/sync");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/drive/files"] })
  });

  const files: DriveFile[] = data?.files || [];
  const categories = [...new Set(files.map(f => f.category).filter(Boolean))];

  const filtered = files.filter(f => {
    const matchCat = selectedCategory === "All" || f.category === selectedCategory;
    const matchSearch = !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || (f.category || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <Layout
      title="Google Drive Documents"
      subtitle="Browse and view RAMS documents synced from your Google Drive folder"
      actions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending} className="gap-2 h-9">
            <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sync Drive</span>
          </Button>
          <a href={FOLDER_URL} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gradient-railway text-white border-0 gap-2 h-9">
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Open Drive</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </a>
        </div>
      }
    >
      {viewingFile && <DocViewer file={viewingFile} onClose={() => setViewingFile(null)} />}

      <div className="p-4 md:p-6 space-y-6">

        {/* Drive Info Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">RAMS Documents Library</div>
                <div className="text-white/80 text-sm">Connected to Google Drive · Folder ID: 1O444fl8fyyf8B0LtVm99FLYvjBtx_TU0</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-xl">{files.length}</div>
                <div className="text-white/70">Documents</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">{syncMutation.data?.lastSync ? "✓" : "—"}</div>
                <div className="text-white/70">Last Sync</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Files", value: files.length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
            { label: "PDF Documents", value: files.filter(f => f.mimeType === "application/pdf").length, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/20" },
            { label: "Presentations", value: files.filter(f => f.mimeType.includes("presentation")).length, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" },
            { label: "Spreadsheets", value: files.filter(f => f.mimeType.includes("sheet")).length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20" },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-card rounded-2xl border border-border p-4 shadow-sm text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search files..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-10" />
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="p-3 space-y-1">
                <div className="text-xs font-semibold text-muted-foreground px-2 pb-2">Categories</div>
                {CATEGORY_FILTERS.map(cat => {
                  const count = cat === "All" ? files.length : files.filter(f => f.category === cat).length;
                  if (count === 0 && cat !== "All") return null;
                  return (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? "bg-railway-blue text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0 ${selectedCategory === cat ? "bg-white/20" : "bg-muted"}`}>{count}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="text-sm font-semibold text-foreground">Drive Connected</div>
              </div>
              <div className="text-xs text-muted-foreground mb-3">Your RAMS folder is synchronized. Click "Sync Drive" to refresh.</div>
              <a href={FOLDER_URL} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="w-full gap-2 text-xs h-8">
                  <Folder className="h-3.5 w-3.5" />
                  Browse in Drive
                </Button>
              </a>
            </div>
          </div>

          {/* File Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                <div className="text-sm text-muted-foreground">Loading documents from Google Drive...</div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
                <div className="text-sm text-muted-foreground">Failed to load documents</div>
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground mb-3 font-medium">
                  Showing <span className="text-foreground font-bold">{filtered.length}</span> of {files.length} documents
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map(file => {
                    const info = getFileInfo(file.mimeType);
                    const Icon = info.icon;
                    return (
                      <div key={file.id} className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-4 hover:border-blue-300 hover:shadow-md transition-all group">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 ${info.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`h-5 w-5 ${info.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-foreground text-sm leading-tight line-clamp-2 mb-1">{file.name}</div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <Badge variant="outline" className="text-xs h-4 px-1.5">{info.label}</Badge>
                              <span>{formatFileSize(file.size)}</span>
                            </div>
                            {file.category && (
                              <div className="text-xs text-blue-600 font-medium mb-2">{file.category}</div>
                            )}
                            <div className="text-xs text-muted-foreground">Modified {formatDate(file.modifiedTime)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs gap-1.5"
                            onClick={() => setViewingFile(file)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <a href={FOLDER_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                            <Button size="sm" variant="outline" className="w-full h-7 text-xs gap-1.5">
                              <ExternalLink className="h-3.5 w-3.5" />
                              Open Drive
                            </Button>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {filtered.length === 0 && (
                  <div className="text-center py-16">
                    <Cloud className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <div className="font-semibold text-foreground mb-1">No documents found</div>
                    <div className="text-sm text-muted-foreground">Try adjusting your search or category filter</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
