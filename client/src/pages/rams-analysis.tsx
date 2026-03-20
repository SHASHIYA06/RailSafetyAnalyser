import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3, TrendingUp, Shield, Clock, Download,
  AlertTriangle, CheckCircle, Activity, Target, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";

const SIL_LEVELS = [
  { level: 4, label: "SIL 4", desc: "Catastrophic failure prevention", count: 6, color: "#7c3aed", bg: "bg-purple-50 border-purple-200 text-purple-700" },
  { level: 3, label: "SIL 3", desc: "Critical safety functions", count: 8, color: "#dc2626", bg: "bg-red-50 border-red-200 text-red-700" },
  { level: 2, label: "SIL 2", desc: "Significant safety impact", count: 6, color: "#d97706", bg: "bg-orange-50 border-orange-200 text-orange-700" },
  { level: 1, label: "SIL 1", desc: "Minor safety consequences", count: 4, color: "#16a34a", bg: "bg-green-50 border-green-200 text-green-700" },
];

const COMPLIANCE_STANDARDS = [
  { standard: "EN 50126", title: "RAMS Lifecycle", compliance: 98, certified: 22, total: 24, trend: 2 },
  { standard: "EN 50155", title: "Rolling Stock Electronics", compliance: 95, certified: 14, total: 16, trend: 1 },
  { standard: "EN 50121", title: "EMC Requirements", compliance: 87, certified: 20, total: 24, trend: -1 },
  { standard: "EN 45545", title: "Fire Protection", compliance: 92, certified: 10, total: 12, trend: 3 },
  { standard: "EN 50716", title: "Software Development", compliance: 89, certified: 12, total: 15, trend: 5 },
  { standard: "IEC 62443", title: "Cybersecurity", compliance: 83, certified: 8, total: 12, trend: 8 },
  { standard: "EN 50129", title: "Safety Related E/E Systems", compliance: 96, certified: 18, total: 20, trend: 0 },
];

const LIFECYCLE_PHASES = [
  { phase: "Concept & Feasibility", status: "complete", completion: 100, standards: "EN 50126-1 §5" },
  { phase: "System Definition", status: "complete", completion: 100, standards: "EN 50126-1 §6" },
  { phase: "Risk Analysis", status: "complete", completion: 100, standards: "EN 50126-1 §7" },
  { phase: "System Requirements", status: "complete", completion: 95, standards: "EN 50126-1 §8" },
  { phase: "Architecture & Design", status: "active", completion: 78, standards: "EN 50126-1 §9" },
  { phase: "Implementation", status: "active", completion: 62, standards: "EN 50126-1 §10" },
  { phase: "Integration & Testing", status: "pending", completion: 30, standards: "EN 50126-1 §11" },
  { phase: "Validation", status: "pending", completion: 0, standards: "EN 50126-1 §12" },
  { phase: "Operation & Maintenance", status: "pending", completion: 0, standards: "EN 50126-1 §13" },
];

function ScoreDonut({ value, color, size = 80 }: { value: number; color: string; size?: number }) {
  const r = size * 0.38;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  const gap = c - dash;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(220, 15%, 90%)" strokeWidth={size * 0.1} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={size * 0.1} strokeLinecap="round"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={c * 0.25}
        style={{ transition: "stroke-dasharray 1s ease-out" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.22} fontWeight="bold" fill={color}>
        {value}%
      </text>
    </svg>
  );
}

export default function RAMSAnalysisPage() {
  const { data: dashboardStats } = useQuery({ queryKey: ['/api/dashboard/stats'] });
  const { data: componentsData } = useQuery({ queryKey: ['/api/components', { limit: 100 }] });

  const avgScore = dashboardStats?.averageRAMSScore ? Math.round(Number(dashboardStats.averageRAMSScore)) : 94;
  const components = componentsData?.components || [];

  const ramsMetrics = [
    { title: "Reliability", value: Math.round(avgScore * 0.97), color: "#2563eb", icon: BarChart3, desc: "Mean Time Between Failures" },
    { title: "Availability", value: Math.round(avgScore * 0.99), color: "#16a34a", icon: TrendingUp, desc: "System Uptime Percentage" },
    { title: "Maintainability", value: Math.round(avgScore * 0.89), color: "#d97706", icon: Clock, desc: "Mean Time To Repair" },
    { title: "Safety", value: Math.round(avgScore * 0.96), color: "#dc2626", icon: Shield, desc: "Safety Integrity Compliance" },
  ];

  const riskDist = components.reduce((acc: any, comp: any) => {
    const r = comp.riskLevel || 'medium';
    acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const topComponents = [...components]
    .sort((a: any, b: any) => (Number(b.ramsScore) || 0) - (Number(a.ramsScore) || 0))
    .slice(0, 8);

  return (
    <Layout
      title="RAMS Analysis"
      subtitle="Comprehensive reliability, availability, maintainability, and safety assessment"
      actions={
        <Button size="sm" className="gradient-railway text-white border-0 shadow-sm gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in">

        {/* RAMS Score Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ramsMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title} className="border-border shadow-sm card-hover">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${metric.color}15` }}>
                      <Icon className="h-5 w-5" style={{ color: metric.color }} />
                    </div>
                    <span className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                  </div>
                  <div className="font-semibold text-foreground text-sm mb-1">{metric.title}</div>
                  <div className="text-xs text-muted-foreground mb-3">{metric.desc}</div>
                  <div className="score-bar">
                    <div className="score-bar-fill" style={{ width: `${metric.value}%`, background: metric.color }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 w-full bg-muted rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="sil" className="rounded-lg text-xs font-semibold">SIL Levels</TabsTrigger>
            <TabsTrigger value="compliance" className="rounded-lg text-xs font-semibold">Compliance</TabsTrigger>
            <TabsTrigger value="lifecycle" className="rounded-lg text-xs font-semibold">Lifecycle</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-5 mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Overall Score */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Overall RAMS Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-8">
                    <ScoreDonut value={avgScore} color="#2563eb" size={100} />
                    <div className="space-y-3 flex-1">
                      {ramsMetrics.map(m => (
                        <div key={m.title} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-medium">{m.title}</span>
                            <span className="font-bold" style={{ color: m.color }}>{m.value}%</span>
                          </div>
                          <div className="score-bar">
                            <div className="score-bar-fill" style={{ width: `${m.value}%`, background: m.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-border">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{dashboardStats?.totalComponents || 24}</div>
                      <div className="text-xs text-muted-foreground">Components</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{dashboardStats?.totalStandards || 20}</div>
                      <div className="text-xs text-muted-foreground">Standards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{dashboardStats?.sil4Count || 6}</div>
                      <div className="text-xs text-muted-foreground">SIL 4 Items</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { key: "low", label: "Low Risk", color: "#16a34a", bg: "bg-green-500" },
                    { key: "very low", label: "Very Low Risk", color: "#15803d", bg: "bg-green-400" },
                    { key: "medium", label: "Medium Risk", color: "#d97706", bg: "bg-orange-500" },
                    { key: "high", label: "High Risk", color: "#dc2626", bg: "bg-red-500" },
                  ].filter(r => riskDist[r.key] > 0).map(r => {
                    const count = riskDist[r.key] || 0;
                    const pct = components.length ? Math.round((count / components.length) * 100) : 0;
                    return (
                      <div key={r.key} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${r.bg}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-foreground">{r.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground text-xs">{count} items</span>
                              <span className="font-bold" style={{ color: r.color }}>{pct}%</span>
                            </div>
                          </div>
                          <div className="score-bar">
                            <div className="score-bar-fill" style={{ width: `${pct}%`, background: r.color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Risk Legend */}
                  <div className="mt-4 p-4 bg-muted/50 rounded-xl space-y-2">
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Risk Classification</div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div>• Low: MTBF &gt; 10,000h</div>
                      <div>• Medium: MTBF 1,000-10,000h</div>
                      <div>• High: MTBF &lt; 1,000h</div>
                      <div>• Per EN 50126-1 §7.4</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Components */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Component RAMS Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topComponents.map((comp: any, i: number) => {
                    const score = Number(comp.ramsScore) || 0;
                    const scoreColor = score >= 90 ? "#16a34a" : score >= 75 ? "#d97706" : "#dc2626";
                    return (
                      <div key={comp.id} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                        <div className="w-7 h-7 gradient-railway rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">{comp.name}</div>
                          <div className="text-xs text-muted-foreground">{comp.manufacturer}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-bold" style={{ color: scoreColor }}>{score.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">SIL {comp.silLevel || 0}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIL Levels Tab */}
          <TabsContent value="sil" className="space-y-5 mt-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {SIL_LEVELS.map(s => (
                <Card key={s.level} className="border-border shadow-sm card-hover">
                  <CardContent className="p-5 text-center">
                    <div className="text-4xl font-black mb-2" style={{ color: s.color }}>SIL {s.level}</div>
                    <div className="text-2xl font-bold text-foreground mb-1">{s.count}</div>
                    <div className="text-xs text-muted-foreground mb-3">{s.desc}</div>
                    <Badge variant="outline" className={`text-xs border ${s.bg}`}>
                      {s.count} components
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">SIL Requirements (IEC 61508 / EN 50126)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">SIL Level</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">PFH Range (1/h)</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Risk Reduction</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Application Examples</th>
                        <th className="text-left py-3 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Our Components</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { sil: 4, pfh: "10⁻⁹ to 10⁻⁸", rr: ">100,000", ex: "ATP, ERTMS, ETCS", count: 6, color: "#7c3aed" },
                        { sil: 3, pfh: "10⁻⁸ to 10⁻⁷", rr: ">10,000", ex: "Train protection, Signaling", count: 8, color: "#dc2626" },
                        { sil: 2, pfh: "10⁻⁷ to 10⁻⁶", rr: ">1,000", ex: "Platform doors, Braking assist", count: 6, color: "#d97706" },
                        { sil: 1, pfh: "10⁻⁶ to 10⁻⁵", rr: ">100", ex: "HVAC control, Lighting", count: 4, color: "#16a34a" },
                      ].map(r => (
                        <tr key={r.sil} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4">
                            <span className="font-bold" style={{ color: r.color }}>SIL {r.sil}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{r.pfh}</td>
                          <td className="py-3 px-4 text-muted-foreground">{r.rr}</td>
                          <td className="py-3 px-4 text-muted-foreground text-xs">{r.ex}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="text-xs">{r.count} items</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-5 mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {COMPLIANCE_STANDARDS.map(item => (
                <Card key={item.standard} className="border-border shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="text-lg font-bold text-foreground">{item.standard}</div>
                        <div className="text-sm text-muted-foreground">{item.title}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-2xl font-black ${
                          item.compliance >= 95 ? 'text-green-600' :
                          item.compliance >= 88 ? 'text-orange-500' : 'text-red-600'
                        }`}>{item.compliance}%</div>
                        <div className={`text-xs font-semibold flex items-center gap-1 justify-end ${item.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.trend >= 0 ? '↑' : '↓'} {Math.abs(item.trend)}% trend
                        </div>
                      </div>
                    </div>

                    <div className="score-bar mb-3">
                      <div className="score-bar-fill" style={{
                        width: `${item.compliance}%`,
                        background: item.compliance >= 95 ? '#16a34a' : item.compliance >= 88 ? '#d97706' : '#dc2626'
                      }} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        <span>{item.certified} certified</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                        <span>{item.total - item.certified} pending</span>
                      </div>
                      <span>{item.total} total</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lifecycle Tab */}
          <TabsContent value="lifecycle" className="space-y-5 mt-5">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">EN 50126-1 RAMS Lifecycle Phases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {LIFECYCLE_PHASES.map((phase, idx) => {
                    const isComplete = phase.status === "complete";
                    const isActive = phase.status === "active";
                    const statusColor = isComplete ? "#16a34a" : isActive ? "#2563eb" : "#9ca3af";
                    const StatusIcon = isComplete ? CheckCircle : isActive ? Activity : Target;
                    return (
                      <div key={phase.phase} className="flex items-center gap-4 p-3.5 rounded-xl border border-border hover:bg-muted/20 transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold border-2"
                          style={{ borderColor: statusColor, color: statusColor, background: `${statusColor}12` }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-foreground">{phase.phase}</span>
                            <StatusIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: statusColor }} />
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 score-bar">
                              <div className="score-bar-fill" style={{ width: `${phase.completion}%`, background: statusColor }} />
                            </div>
                            <span className="text-xs font-bold w-8 text-right" style={{ color: statusColor }}>{phase.completion}%</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xs text-muted-foreground">{phase.standards}</div>
                          <Badge variant="outline" className={`text-xs mt-1 ${
                            isComplete ? 'border-green-200 text-green-700 bg-green-50' :
                            isActive ? 'border-blue-200 text-blue-700 bg-blue-50' :
                            'border-gray-200 text-gray-500'
                          }`}>
                            {isComplete ? "Complete" : isActive ? "In Progress" : "Planned"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
