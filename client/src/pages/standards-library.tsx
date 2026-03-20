import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FileText, ExternalLink, Search, Download, BookOpen, Shield,
  Cpu, Zap, Flame, Wifi, ChevronRight, Star, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  "RAMS": { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: BarChart3 },
  "EMC": { color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Zap },
  "Software": { color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: Cpu },
  "Fire Protection": { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: Flame },
  "Cybersecurity": { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: Shield },
  "Rolling Stock": { color: "text-green-700", bg: "bg-green-50 border-green-200", icon: Train },
  "Signaling": { color: "text-teal-700", bg: "bg-teal-50 border-teal-200", icon: Wifi },
  "Track": { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: BookOpen },
};

import { BarChart3, Train } from "lucide-react";

const FEATURED = [
  {
    code: "EN 50126",
    title: "Railway Applications - RAMS",
    parts: ["EN 50126-1: Generic RAMS process", "EN 50126-2: Systems approach to safety"],
    description: "The foundational RAMS standard defining the lifecycle approach for railway systems.",
    color: "from-blue-600 to-blue-800",
  },
  {
    code: "EN 50716",
    title: "Software for Railway Control & Protection",
    parts: ["Replaced EN 50128 in 2024", "Enhanced cybersecurity provisions", "Modern dev methodologies"],
    description: "New 2024 software development standard with modern methodologies and security requirements.",
    color: "from-green-600 to-green-800",
  },
  {
    code: "IEC 62443",
    title: "Industrial Cybersecurity Standard",
    parts: ["Adapted for railway (CLC/TS 50701)", "Security Levels 1-4", "Zone/Conduit model"],
    description: "Critical cybersecurity framework increasingly mandated for rail control systems.",
    color: "from-orange-500 to-orange-700",
  },
];

const CATEGORIES = ["RAMS", "EMC", "Software", "Fire Protection", "Cybersecurity", "Rolling Stock", "Signaling", "Track"];

export default function StandardsLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: standardsData, isLoading } = useQuery({
    queryKey: ['/api/standards', { search: searchQuery, category: selectedCategory }],
  });

  const standards = standardsData?.standards || [];
  const total = standardsData?.total || standards.length;

  return (
    <Layout
      title="Standards Library"
      subtitle="EN / IEC railway standards catalog with compliance documentation"
      actions={
        <Button size="sm" className="gradient-railway text-white border-0 shadow-sm gap-2">
          <Download className="h-4 w-4" />
          Export List
        </Button>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in">

        {/* Featured Standards Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED.map((f) => (
            <div key={f.code} className={`bg-gradient-to-br ${f.color} rounded-2xl p-5 text-white card-hover shadow-lg`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1">Featured</div>
                  <h3 className="text-xl font-bold">{f.code}</h3>
                </div>
                <Star className="h-5 w-5 text-yellow-300 fill-yellow-300 flex-shrink-0" />
              </div>
              <p className="text-sm text-white/80 mb-4 leading-relaxed">{f.description}</p>
              <ul className="space-y-1">
                {f.parts.map(p => (
                  <li key={p} className="text-xs text-white/70 flex items-start gap-1.5">
                    <span className="text-white/50 mt-0.5">•</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by code, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-muted/50 border-border text-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-11 border border-border rounded-lg px-3 text-sm bg-background focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !selectedCategory
                  ? "gradient-railway text-white border-transparent shadow-sm"
                  : "bg-muted text-muted-foreground border-border hover:border-blue-300 hover:text-foreground"
              }`}
            >
              All ({total})
            </button>
            {CATEGORIES.map(cat => {
              const count = standards.filter((s: any) => s.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedCategory === cat
                      ? "gradient-railway text-white border-transparent shadow-sm"
                      : "bg-muted text-muted-foreground border-border hover:border-blue-300 hover:text-foreground"
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">
            <span className="text-railway-blue">{standards.length}</span> standards found
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            {selectedCategory || "All categories"}
          </div>
        </div>

        {/* Standards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-card rounded-2xl border border-border p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : standards.length === 0 ? (
          <div className="bg-white dark:bg-card rounded-2xl border border-border p-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No standards found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {standards.map((standard: any) => {
              const catConfig = CATEGORY_CONFIG[standard.category] || {
                color: "text-gray-700", bg: "bg-gray-50 border-gray-200", icon: FileText
              };
              const Icon = catConfig.icon;

              return (
                <Card key={standard.id} className="card-hover border-border shadow-sm hover:shadow-md overflow-hidden">
                  <CardContent className="p-0">
                    {/* Top accent bar */}
                    <div className={`h-1 w-full ${
                      standard.category === 'RAMS' ? 'bg-blue-500' :
                      standard.category === 'EMC' ? 'bg-purple-500' :
                      standard.category === 'Software' ? 'bg-indigo-500' :
                      standard.category === 'Fire Protection' ? 'bg-red-500' :
                      standard.category === 'Cybersecurity' ? 'bg-orange-500' :
                      standard.category === 'Rolling Stock' ? 'bg-green-500' :
                      'bg-blue-400'
                    }`} />

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${catConfig.bg}`}>
                            <Icon className={`h-5 w-5 ${catConfig.color}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground leading-tight">{standard.code}</h3>
                            <Badge variant="outline" className={`text-xs mt-1 border ${catConfig.bg} ${catConfig.color}`}>
                              {standard.category}
                            </Badge>
                          </div>
                        </div>
                        {standard.pdfUrl && (
                          <a
                            href={standard.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-railway-blue hover:bg-blue-50 transition-colors flex-shrink-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>

                      <h4 className="text-sm font-semibold text-foreground mb-2 leading-snug">{standard.title}</h4>

                      {standard.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                          {standard.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span className="bg-muted px-2 py-0.5 rounded-full font-medium">
                          Version: {standard.version || "Current"}
                        </span>
                        <span>
                          {standard.publishedDate
                            ? new Date(standard.publishedDate).getFullYear()
                            : "Active"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-semibold border ${
                          standard.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {standard.status || "Active"}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                          View Clauses
                        </Button>
                        {standard.pdfUrl && (
                          <Button size="sm" asChild className="h-8 text-xs gap-1 gradient-railway text-white border-0">
                            <a href={standard.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-3 w-3" />
                              PDF
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Banner */}
        <div className="gradient-dark rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">Standards Coverage Notice</h3>
              <p className="text-white/60 text-sm">
                This library contains metadata, summaries, and compliance references for EN/IEC railway standards.
                Full copyrighted text requires official purchase from CENELEC, IEC, or national standards bodies.
              </p>
            </div>
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 flex-shrink-0 gap-2">
              <ExternalLink className="h-4 w-4" />
              CENELEC Portal
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
