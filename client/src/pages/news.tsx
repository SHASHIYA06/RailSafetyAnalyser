import { useState } from "react";
import { Newspaper, ExternalLink, Clock, Tag, RefreshCw, Globe, Train, Zap, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";

const RAIL_NEWS = [
  {
    id: 1,
    title: "European Rail Traffic Management System (ERTMS) Deployment Accelerates Across EU",
    summary: "The European Commission has approved €2.4 billion in funding to accelerate ERTMS deployment on the TEN-T core network. Member states must complete installation on core corridors by 2030, with EN 50126 RAMS compliance mandatory for all new deployments.",
    source: "Railway Gazette International",
    category: "Standards & Compliance",
    time: "2 hours ago",
    url: "#",
    featured: true,
    tags: ["ERTMS", "ETCS", "EN 50126", "EU Funding"],
    icon: Shield,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    title: "CENELEC Releases EN 50716:2024 Software Development Standard Update",
    summary: "The new EN 50716 standard officially replaces EN 50128 for railway software development. Key changes include enhanced cybersecurity integration with IEC 62443, updated tool qualification requirements, and modern agile development methodology provisions.",
    source: "CENELEC Official",
    category: "New Standards",
    time: "4 hours ago",
    url: "#",
    featured: true,
    tags: ["EN 50716", "Software", "Cybersecurity"],
    icon: Zap,
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    id: 3,
    title: "Siemens Mobility Achieves SIL 4 Certification for TRAINGUARD MT CBTC System",
    summary: "Siemens Mobility has received SIL 4 certification from TÜV SÜD for its TRAINGUARD MT Communication-Based Train Control system, compliant with EN 50126, EN 50128, and EN 50129 standards.",
    source: "Siemens Mobility Press",
    category: "Industry News",
    time: "6 hours ago",
    url: "#",
    featured: false,
    tags: ["CBTC", "SIL 4", "Siemens", "Certification"],
    icon: Train,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    id: 4,
    title: "CLC/TS 50701 Railway Cybersecurity Implementation Guide Published",
    summary: "The Technical Specification CLC/TS 50701, adapting IEC 62443 for railway applications, now includes updated implementation guidance. Rail operators must conduct Security Level assessments for all ETCS and CBTC onboard units by Q2 2025.",
    source: "Rail Technology Magazine",
    category: "Cybersecurity",
    time: "8 hours ago",
    url: "#",
    featured: false,
    tags: ["CLC/TS 50701", "IEC 62443", "ETCS", "Security"],
    icon: Shield,
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    id: 5,
    title: "UK's Network Rail Completes Major RAMS Assessment for HS2 Phase 1",
    summary: "Network Rail has completed the RAMS lifecycle assessment for HS2 Phase 1 infrastructure, confirming compliance with EN 50126-1 and EN 50126-2 for all safety-critical systems including signalling, power supply, and rolling stock interfaces.",
    source: "Network Rail Press Office",
    category: "Projects",
    time: "12 hours ago",
    url: "#",
    featured: false,
    tags: ["HS2", "Network Rail", "EN 50126", "Infrastructure"],
    icon: Train,
    color: "text-teal-600",
    bg: "bg-teal-50"
  },
  {
    id: 6,
    title: "IEC Technical Committee Publishes Updated EN 50155 Rolling Stock Standard",
    summary: "The revised EN 50155:2021+A1:2023 now includes strengthened requirements for cybersecurity of onboard electronics, updated environmental testing for EMI/EMC, and new provisions for battery electric and hydrogen fuel cell rolling stock.",
    source: "IEC News",
    category: "Standards & Compliance",
    time: "1 day ago",
    url: "#",
    featured: false,
    tags: ["EN 50155", "Rolling Stock", "EMC", "Hydrogen"],
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50"
  },
  {
    id: 7,
    title: "Alstom and Thales Partner on Mainline ETCS Level 3 Implementation",
    summary: "Alstom and Thales have announced a joint technical partnership to develop the world's first operational ETCS Level 3 Moving Block system, offering 50% capacity increase with SIL 4 safety requirements per EN 50126.",
    source: "Global Railway Review",
    category: "Industry News",
    time: "1 day ago",
    url: "#",
    featured: false,
    tags: ["ETCS", "Alstom", "Thales", "Moving Block"],
    icon: Train,
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    id: 8,
    title: "EN 45545-2 Fire Protection Standard: Harmonisation Progress Report",
    summary: "The ERA has published progress on EN 45545-2 harmonisation across member states, with 24 of 27 EU countries now fully implementing the Hazard Levels HL1-HL3 requirements for railway vehicle materials and components.",
    source: "ERA News",
    category: "Standards & Compliance",
    time: "2 days ago",
    url: "#",
    featured: false,
    tags: ["EN 45545", "Fire Protection", "ERA", "Harmonisation"],
    icon: Shield,
    color: "text-red-600",
    bg: "bg-red-50"
  },
];

const CATEGORIES = ["All", "Standards & Compliance", "New Standards", "Industry News", "Cybersecurity", "Projects"];

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filtered = selectedCategory === "All"
    ? RAIL_NEWS
    : RAIL_NEWS.filter(n => n.category === selectedCategory);

  const featured = filtered.filter(n => n.featured);
  const regular = filtered.filter(n => !n.featured);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <Layout
      title="Rail & Metro News"
      subtitle="Daily railway industry updates, standards releases, and technology news"
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in">

        {/* Live Banner */}
        <div className="gradient-dark rounded-2xl p-5 text-white flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
            <div>
              <div className="font-bold">Live Industry Feed</div>
              <div className="text-white/60 text-sm">Updated daily at 17:00 CET · {RAIL_NEWS.length} articles today</div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-auto flex-wrap">
            {[
              { label: "Standards", count: 3 },
              { label: "Industry", count: 3 },
              { label: "Projects", count: 2 },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold">{s.count}</div>
                <div className="text-xs text-white/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                selectedCategory === cat
                  ? "gradient-railway text-white border-transparent shadow-sm"
                  : "bg-white dark:bg-card border-border text-muted-foreground hover:border-blue-300 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Articles */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Featured Today</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featured.map(news => {
                const Icon = news.icon;
                return (
                  <Card key={news.id} className="border-border shadow-sm card-hover overflow-hidden">
                    <div className="h-1.5 gradient-railway" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className={`w-10 h-10 ${news.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-5 w-5 ${news.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs mb-2 bg-blue-50 text-blue-700 border-blue-200">
                            {news.category}
                          </Badge>
                          <h3 className="text-sm font-bold text-foreground leading-snug">{news.title}</h3>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{news.summary}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {news.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1"><Globe className="h-3 w-3" />{news.source}</div>
                          <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{news.time}</div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-railway-blue">
                          Read <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Articles */}
        {regular.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Latest Updates</h2>
            <div className="space-y-3">
              {regular.map(news => {
                const Icon = news.icon;
                return (
                  <div key={news.id} className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-4 card-hover">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${news.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${news.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                          <h3 className="text-sm font-bold text-foreground leading-snug flex-1">{news.title}</h3>
                          <Badge variant="outline" className="text-xs flex-shrink-0">{news.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">{news.summary}</p>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex flex-wrap gap-1.5">
                            {news.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                            <span>{news.source}</span>
                            <span>{news.time}</span>
                            <Button variant="ghost" size="sm" className="h-6 text-xs gap-1 p-0 text-railway-blue">
                              Read <ExternalLink className="h-3 w-3" />
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
        )}
      </div>
    </Layout>
  );
}
