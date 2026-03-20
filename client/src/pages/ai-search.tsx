import { useState, useRef } from "react";
import { Search, Mic, MicOff, Loader2, Sparkles, BookOpen, Package, ExternalLink, ChevronRight, Bot, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout";

declare global {
  interface Window { SpeechRecognition: any; webkitSpeechRecognition: any; }
}

interface SearchResult {
  components: any[];
  standards: any[];
  aiSummary: string;
  total: number;
}

const SUGGESTED_QUERIES = [
  "SIL 4 requirements for railway signaling",
  "EN 50126 RAMS lifecycle phases",
  "ETCS Level 2 onboard unit specifications",
  "Fire protection EN 45545 requirements",
  "CBTC communication safety",
  "EN 50716 software development standard",
  "Brake system SIL certification",
  "Traction motor control RAMS score",
  "Hazard log requirements railway",
  "Cybersecurity IEC 62443 railway",
];

const getRiskColor = (risk: string) => {
  if (!risk) return "bg-gray-100 text-gray-600";
  switch (risk.toLowerCase()) {
    case "very low": return "bg-green-100 text-green-700";
    case "low": return "bg-blue-100 text-blue-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "high": return "bg-red-100 text-red-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const getSilColor = (sil: number) => {
  if (sil === 4) return "bg-red-600 text-white";
  if (sil === 3) return "bg-orange-500 text-white";
  if (sil === 2) return "bg-yellow-500 text-white";
  if (sil === 1) return "bg-green-500 text-white";
  return "bg-gray-400 text-white";
};

export default function AISearchPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "components" | "standards">("all");
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice search not supported in this browser. Use Chrome."); return; }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setQuery(t);
      setIsListening(false);
      performSearch(t);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const performSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setIsLoading(true);
    setResults(null);
    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q })
      });
      const data = await response.json();
      setResults(data);
    } catch {
      setResults({ components: [], standards: [], aiSummary: "Search failed. Please try again.", total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAISummary = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold text-foreground mt-3 mb-1">{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.match(/^\*\*.*\*\*/)) {
        return <div key={i} className="mt-2">{line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').split(/(<strong>.*?<\/strong>)/).map((part, j) => {
          if (part.startsWith('<strong>')) return <strong key={j}>{part.replace(/<\/?strong>/g, '')}</strong>;
          return <span key={j}>{part}</span>;
        })}</div>;
      }
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        return <div key={i} className="flex gap-2 mt-1 ml-2"><span className="text-blue-500">•</span><span>{line.replace(/^[•\-\*]\s*/, '')}</span></div>;
      }
      if (line.startsWith('#')) return <div key={i} className="font-bold text-lg text-foreground mt-4 mb-2">{line.replace(/^#+\s*/, '')}</div>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <div key={i} className="leading-relaxed">{line}</div>;
    });
  };

  return (
    <Layout
      title="AI-Powered Search"
      subtitle="Search components, standards, and RAMS knowledge with Khushi AI"
      actions={
        <Badge className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 gap-1">
          <Sparkles className="h-3 w-3" />
          Gemini AI
        </Badge>
      }
    >
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">

        {/* Hero Search Bar */}
        <div className="relative">
          <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 gradient-railway rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") performSearch(); }}
                placeholder="Ask anything about railway standards, components, RAMS, SIL levels..."
                className="flex-1 bg-transparent text-base text-foreground placeholder-muted-foreground outline-none min-w-0"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={isListening ? () => { recognitionRef.current?.stop(); setIsListening(false); } : startListening}
                  className={`p-2.5 rounded-xl transition-all ${isListening ? "bg-red-100 text-red-500 dark:bg-red-950/30 animate-pulse" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  title="Voice Search"
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <Button onClick={() => performSearch()} disabled={isLoading || !query.trim()} className="gradient-railway text-white border-0 gap-2 px-5">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
            {isListening && (
              <div className="px-4 pb-3">
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening for your voice...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggested Queries */}
        {!results && !isLoading && (
          <div className="space-y-6">
            <div>
              <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map(q => (
                  <button
                    key={q}
                    onClick={() => { setQuery(q); performSearch(q); }}
                    className="text-sm bg-white dark:bg-card border border-border hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:text-blue-700 text-foreground px-3 py-1.5 rounded-full transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Brain, title: "AI-Powered Answers", desc: "Get expert RAMS guidance powered by Gemini AI with railway-specific knowledge", color: "text-violet-600 bg-violet-50 dark:bg-violet-950/20" },
                { icon: Package, title: "Component Intelligence", desc: "Search 24+ railway components with SIL levels, RAMS scores, and compliance data", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20" },
                { icon: BookOpen, title: "Standards Reference", desc: "Instant access to 30+ EN/IEC standards with summaries and clause guidance", color: "text-green-600 bg-green-50 dark:bg-green-950/20" },
              ].map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="bg-white dark:bg-card rounded-2xl border border-border p-5 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${f.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-semibold text-foreground mb-1">{f.title}</div>
                    <div className="text-sm text-muted-foreground">{f.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-card rounded-2xl border border-border p-10 text-center shadow-sm">
            <div className="w-16 h-16 gradient-railway rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-white animate-bounce" />
            </div>
            <div className="text-lg font-semibold text-foreground mb-2">Khushi is analyzing...</div>
            <div className="text-sm text-muted-foreground">Searching components, standards, and generating AI insights</div>
            <div className="flex justify-center gap-1.5 mt-4">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <div className="space-y-5">
            {/* Result count + tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Found <span className="font-bold text-foreground">{results.total}</span> results for "<span className="font-bold text-foreground">{query}</span>"
              </div>
              <div className="flex gap-1 bg-muted p-1 rounded-xl">
                {(["all", "components", "standards"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-white dark:bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab} {tab === "components" && `(${results.components.length})`} {tab === "standards" && `(${results.standards.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            {(activeTab === "all") && results.aiSummary && (
              <div className="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 gradient-railway rounded-lg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Khushi AI Analysis</div>
                    <div className="text-xs text-muted-foreground">Powered by Gemini AI</div>
                  </div>
                </div>
                <div className="text-sm text-foreground/90 leading-relaxed space-y-1">
                  {formatAISummary(results.aiSummary)}
                </div>
              </div>
            )}

            {/* Components */}
            {(activeTab === "all" || activeTab === "components") && results.components.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-blue-600" />
                  <h3 className="font-bold text-foreground">Railway Components</h3>
                  <Badge variant="outline" className="text-xs">{results.components.length} found</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.components.map((comp: any) => (
                    <div key={comp.id} className="bg-white dark:bg-card rounded-2xl border border-border p-4 shadow-sm hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="font-semibold text-foreground text-sm leading-tight">{comp.name}</div>
                        {comp.silLevel > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0 ${getSilColor(comp.silLevel)}`}>SIL {comp.silLevel}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">{comp.manufacturer} · {comp.model}</div>
                      {comp.description && <div className="text-xs text-muted-foreground line-clamp-2 mb-3">{comp.description}</div>}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{comp.category}</Badge>
                          {comp.ramsScore && <span className="text-xs font-bold text-blue-600">RAMS: {comp.ramsScore.toFixed(1)}</span>}
                        </div>
                        {comp.riskLevel && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRiskColor(comp.riskLevel)}`}>{comp.riskLevel}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standards */}
            {(activeTab === "all" || activeTab === "standards") && results.standards.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <h3 className="font-bold text-foreground">Relevant Standards</h3>
                  <Badge variant="outline" className="text-xs">{results.standards.length} found</Badge>
                </div>
                <div className="space-y-2">
                  {results.standards.map((std: any) => (
                    <div key={std.id} className="bg-white dark:bg-card rounded-2xl border border-border p-4 shadow-sm hover:border-green-300 transition-colors flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-bold text-foreground text-sm">{std.code}</div>
                            <div className="text-sm text-foreground/80 line-clamp-1">{std.title}</div>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">{std.category}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{std.description}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">Version {std.version}</span>
                          {std.pdfUrl && (
                            <a href={std.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
                              <ExternalLink className="h-3 w-3" />
                              View Standard
                            </a>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.total === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <div className="font-semibold text-foreground mb-1">No results found</div>
                <div className="text-sm text-muted-foreground">Try different keywords or use one of the suggested searches above</div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
