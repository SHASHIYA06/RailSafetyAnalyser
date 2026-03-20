import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Train, Shield, BookOpen, BarChart3, TrendingUp, Clock, Zap, AlertTriangle,
  CheckCircle, ArrowRight, Activity, Database, FileText, ChevronRight, Search
} from "lucide-react";
import Layout from "@/components/layout";
import StatCard from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const RAMS_CATEGORIES = [
  { key: "reliability", label: "Reliability", color: "#2563eb", description: "MTBF compliance" },
  { key: "availability", label: "Availability", color: "#16a34a", description: "System uptime" },
  { key: "maintainability", label: "Maintainability", color: "#d97706", description: "MTTR metrics" },
  { key: "safety", label: "Safety", color: "#dc2626", description: "SIL compliance" },
];

const COMPLIANCE_DATA = [
  { standard: "EN 50126", category: "RAMS", compliance: 98, components: 18 },
  { standard: "EN 50155", category: "Rolling Stock", compliance: 95, components: 14 },
  { standard: "EN 50121", category: "EMC", compliance: 87, components: 16 },
  { standard: "EN 45545", category: "Fire Protection", compliance: 92, components: 10 },
  { standard: "EN 50716", category: "Software", compliance: 89, components: 12 },
  { standard: "IEC 62443", category: "Cybersecurity", compliance: 83, components: 8 },
];

const SYSTEM_CATEGORIES = [
  { name: "Power & Electrical", count: 6, icon: Zap, color: "bg-blue-500" },
  { name: "Control & Signaling", count: 5, icon: Activity, color: "bg-green-500" },
  { name: "Safety Systems", count: 4, icon: Shield, color: "bg-red-500" },
  { name: "Rolling Stock", count: 4, icon: Train, color: "bg-purple-500" },
  { name: "Infrastructure", count: 3, icon: Database, color: "bg-orange-500" },
  { name: "Communication", count: 2, icon: FileText, color: "bg-teal-500" },
];

const RECENT_ACTIVITY = [
  { action: "Component Added", detail: "Siemens SIBAS 32 TCS", time: "2h ago", type: "add" },
  { action: "Standard Updated", detail: "EN 50716:2024 Revision", time: "4h ago", type: "update" },
  { action: "RAMS Analysis", detail: "ABB Power Module Assessment", time: "6h ago", type: "analysis" },
  { action: "Compliance Check", detail: "Bombardier Bogie System", time: "8h ago", type: "compliance" },
  { action: "Export Generated", detail: "Monthly RAMS Report PDF", time: "1d ago", type: "export" },
];

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['/api/dashboard/stats'] });
  const { data: componentsData } = useQuery({ queryKey: ['/api/components', { limit: 5, sortBy: 'rams_score' }] });
  const { data: standardsData } = useQuery({ queryKey: ['/api/standards', { limit: 100 }] });

  const totalComponents = stats?.totalComponents || 24;
  const totalStandards = stats?.totalStandards || 20;
  const avgScore = stats?.averageRAMSScore ? Math.round(stats.averageRAMSScore) : 94;

  const topComponents = componentsData?.components
    ?.sort((a: any, b: any) => (Number(b.ramsScore) || 0) - (Number(a.ramsScore) || 0))
    .slice(0, 5) || [];

  return (
    <Layout
      title="RAMS Intelligence Dashboard"
      subtitle="Real-time railway standards and component compliance overview"
      actions={
        <Button size="sm" className="gradient-railway text-white border-0 shadow-md">
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in">

        {/* Hero Banner */}
        <div className="gradient-dark rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-48 h-48 rounded-full border-4 border-white/30"></div>
            <div className="absolute -bottom-12 right-24 w-72 h-72 rounded-full border border-white/20"></div>
            <div className="absolute top-8 right-40 w-16 h-16 rounded-full bg-white/10"></div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">System Online</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">Rail & Metro RAMS Intelligence</h2>
              <p className="text-white/60 text-sm max-w-xl">
                Comprehensive EN/IEC standards compliance platform for railway safety engineers. 
                Search components, verify RAMS compliance, and generate safety reports.
              </p>
            </div>
            <div className="flex gap-6 flex-shrink-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{avgScore}%</div>
                <div className="text-white/50 text-xs">Avg RAMS Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{totalComponents}</div>
                <div className="text-white/50 text-xs">Components</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{totalStandards}</div>
                <div className="text-white/50 text-xs">Standards</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Components"
            value={totalComponents}
            subtitle="Railway equipment database"
            icon={<Train className="h-6 w-6 text-white" />}
            gradient="gradient-railway"
            trend={{ value: 12, label: "this month" }}
          />
          <StatCard
            title="EN/IEC Standards"
            value={totalStandards}
            subtitle="Active compliance standards"
            icon={<BookOpen className="h-6 w-6 text-white" />}
            gradient="gradient-success"
            trend={{ value: 3, label: "new this year" }}
          />
          <StatCard
            title="Avg RAMS Score"
            value={`${avgScore}%`}
            subtitle="Platform-wide compliance"
            icon={<BarChart3 className="h-6 w-6 text-white" />}
            gradient="gradient-warning"
            trend={{ value: 2.4, label: "vs last quarter" }}
          />
          <StatCard
            title="SIL 4 Certified"
            value={stats?.sil4Count || 6}
            subtitle="Highest safety integrity"
            icon={<Shield className="h-6 w-6 text-white" />}
            gradient="gradient-danger"
            trend={{ value: 1, label: "new certified" }}
          />
        </div>

        {/* RAMS Score Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RAMS Breakdown */}
          <Card className="lg:col-span-2 shadow-sm border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">RAMS Category Scores</CardTitle>
                <Badge variant="outline" className="text-xs">Live Data</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {RAMS_CATEGORIES.map((cat) => {
                const scores: Record<string, number> = {
                  reliability: stats ? Math.round(Number(stats.averageRAMSScore) * 0.97) : 94,
                  availability: stats ? Math.round(Number(stats.averageRAMSScore) * 0.99) : 98,
                  maintainability: stats ? Math.round(Number(stats.averageRAMSScore) * 0.89) : 87,
                  safety: stats ? Math.round(Number(stats.averageRAMSScore) * 0.96) : 96,
                };
                const score = scores[cat.key];
                return (
                  <div key={cat.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-semibold text-foreground">{cat.label}</span>
                        <span className="text-muted-foreground ml-2 text-xs">{cat.description}</span>
                      </div>
                      <span className="font-bold" style={{ color: cat.color }}>{score}%</span>
                    </div>
                    <div className="score-bar">
                      <div
                        className="score-bar-fill"
                        style={{ width: `${score}%`, background: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Overall RAMS Score</span>
                  <span className="text-xl font-bold text-railway-blue">{avgScore}%</span>
                </div>
                <Progress value={avgScore} className="mt-2 h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Panel */}
          <div className="space-y-4">
            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Low Risk", count: 10, color: "bg-green-500", pct: 42 },
                  { label: "Medium Risk", count: 11, color: "bg-orange-500", pct: 46 },
                  { label: "High Risk", count: 3, color: "bg-red-500", pct: 12 },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${r.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{r.label}</span>
                        <span className="font-semibold">{r.count}</span>
                      </div>
                      <div className="score-bar">
                        <div className={`score-bar-fill ${r.color}`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Certification Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Certified", count: 16, icon: CheckCircle, color: "text-green-500" },
                  { label: "In Progress", count: 5, icon: Clock, color: "text-orange-500" },
                  { label: "Pending Review", count: 3, icon: AlertTriangle, color: "text-red-500" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${s.color}`} />
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                      </div>
                      <span className="text-sm font-bold">{s.count}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Systems & Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Categories */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Components by System</CardTitle>
                <Link href="/components">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    View All <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {SYSTEM_CATEGORIES.map((sys) => {
                  const Icon = sys.icon;
                  return (
                    <div key={sys.name} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className={`w-9 h-9 ${sys.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{sys.name}</div>
                        <div className="text-xs text-muted-foreground">{sys.count} components</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Standards Compliance */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Standards Compliance</CardTitle>
                <Link href="/standards">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    All Standards <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {COMPLIANCE_DATA.map((item) => (
                <div key={item.standard} className="flex items-center gap-3">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-xs font-bold text-foreground">{item.standard}</div>
                    <div className="text-xs text-muted-foreground">{item.category}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="score-bar">
                      <div
                        className="score-bar-fill"
                        style={{
                          width: `${item.compliance}%`,
                          background: item.compliance >= 95 ? '#16a34a' : item.compliance >= 88 ? '#d97706' : '#dc2626'
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right flex-shrink-0">
                    <span className={`text-xs font-bold ${
                      item.compliance >= 95 ? 'text-green-600' : item.compliance >= 88 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {item.compliance}%
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">{item.components}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Components & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Components */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Top RAMS Components</CardTitle>
                <Link href="/components">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    Search All <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {topComponents.length > 0 ? topComponents.map((comp: any, i: number) => (
                <div key={comp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-7 h-7 gradient-railway rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">{comp.name}</div>
                    <div className="text-xs text-muted-foreground">{comp.manufacturer}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-green-600">{Number(comp.ramsScore)?.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">SIL {comp.silLevel || 0}</div>
                  </div>
                </div>
              )) : [1,2,3,4,5].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
                  <div className="w-7 h-7 bg-muted rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="w-12 h-6 bg-muted rounded" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {RECENT_ACTIVITY.map((activity, i) => {
                const colors: Record<string, string> = {
                  add: "bg-blue-500",
                  update: "bg-green-500",
                  analysis: "bg-purple-500",
                  compliance: "bg-orange-500",
                  export: "bg-teal-500",
                };
                return (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${colors[activity.type]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-foreground">{activity.action}</div>
                      <div className="text-xs text-muted-foreground truncate">{activity.detail}</div>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{activity.time}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/components", label: "Search Components", desc: "Find railway equipment", icon: Search, gradient: "gradient-railway" },
            { href: "/standards", label: "Standards Library", desc: "EN/IEC documents", icon: BookOpen, gradient: "gradient-success" },
            { href: "/rams", label: "RAMS Analysis", desc: "Safety assessment", icon: BarChart3, gradient: "gradient-warning" },
            { href: "/news", label: "Rail News", desc: "Industry updates", icon: TrendingUp, gradient: "gradient-danger" },
          ].map((nav) => {
            const Icon = nav.icon;
            return (
              <Link key={nav.href} href={nav.href}>
                <div className={`${nav.gradient} text-white rounded-2xl p-5 card-hover cursor-pointer shadow-md`}>
                  <Icon className="h-6 w-6 mb-3 opacity-90" />
                  <div className="font-semibold text-sm">{nav.label}</div>
                  <div className="text-white/60 text-xs mt-0.5">{nav.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
