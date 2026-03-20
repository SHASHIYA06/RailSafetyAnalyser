import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Newspaper, Clock, ExternalLink, Tag, RefreshCw, TrendingUp,
  Loader2, AlertCircle, BookOpen, Factory, Shield, Cpu, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";

const CATEGORY_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  "Standards Update": { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
  "Industry News": { icon: Factory, color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/20" },
  "Certification": { icon: Shield, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/20" },
  "Regulation": { icon: Cpu, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/20" },
  "Technology": { icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-950/20" },
};

const getCategoryConfig = (cat: string) =>
  CATEGORY_ICONS[cat] || { icon: Newspaper, color: "text-gray-600", bg: "bg-gray-50 dark:bg-gray-900/20" };

const formatDate = (iso: string) => {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - d.getTime()) / 1000 / 60 / 60);
    if (diffH < 1) return "Just now";
    if (diffH < 24) return `${diffH}h ago`;
    const days = Math.floor(diffH / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch { return iso; }
};

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["/api/news"],
    queryFn: async () => {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const articles = data?.articles || [];
  const categories = ["All", ...Array.from(new Set<string>(articles.map((a: any) => a.category)))];
  const filtered = selectedCategory === "All" ? articles : articles.filter((a: any) => a.category === selectedCategory);

  return (
    <Layout
      title="Rail & Metro News"
      subtitle="Latest railway industry updates, standards changes, and technology news"
      actions={
        <Button size="sm" variant="outline" onClick={() => refetch()} disabled={isFetching} className="gap-2 h-9">
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      }
    >
      <div className="p-4 md:p-6 space-y-6">

        {/* Hero */}
        <div className="gradient-railway rounded-2xl p-5 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl">Railway Intelligence Feed</div>
                <div className="text-white/80 text-sm">Standards · Industry · Safety · Technology</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="text-white/80 text-sm">Live updates</div>
            </div>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map(cat => {
            const cfg = getCategoryConfig(cat);
            const Icon = cfg.icon;
            const count = cat === "All" ? articles.length : articles.filter((a: any) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === cat
                    ? "gradient-railway text-white border-transparent shadow"
                    : "bg-white dark:bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat !== "All" && <Icon className="h-3.5 w-3.5" />}
                {cat}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat ? "bg-white/20" : "bg-muted"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
            <div className="text-sm text-muted-foreground">Loading latest railway news...</div>
          </div>
        )}

        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
            <div className="text-sm text-muted-foreground">Failed to load news. Please refresh.</div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">
              Showing <span className="text-foreground font-bold">{filtered.length}</span> articles
            </div>
            {filtered.map((article: any, i: number) => {
              const cfg = getCategoryConfig(article.category);
              const Icon = cfg.icon;
              return (
                <div key={article.id || i} className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-5 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className={`w-12 h-12 ${cfg.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <Badge variant="outline" className={`text-xs mb-2`}>{article.category}</Badge>
                          <h3 className="font-bold text-foreground text-base leading-snug">{article.title}</h3>
                        </div>
                        {i === 0 && <Badge className="gradient-railway text-white border-0 text-xs flex-shrink-0">Latest</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{article.summary}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="h-3.5 w-3.5" />
                          <span className="font-medium text-foreground">{article.source}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(article.publishedAt)}
                        </div>
                      </div>
                      {article.tags && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {article.tags.map((tag: string) => (
                            <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                              <Tag className="h-3 w-3" />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="gap-2 h-8 text-xs">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Read Full Article
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <div className="font-semibold text-foreground">No articles in this category</div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
