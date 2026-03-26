import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Settings, Database, Users, Shield, Activity, RefreshCw,
  CheckCircle, Clock, AlertTriangle, Plus, Edit, Trash2,
  BarChart3, Zap, Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout";
import type { DashboardStats, Component, Standard } from "@/types/api";

const SYSTEM_JOBS = [
  { id: 1, name: "Database Sync", status: "completed", lastRun: "5 min ago", duration: "2.3s", type: "sync" },
  { id: 2, name: "Standards Index Rebuild", status: "completed", lastRun: "1h ago", duration: "45s", type: "index" },
  { id: 3, name: "RAMS Score Recalculation", status: "running", lastRun: "Running...", duration: "-", type: "compute" },
  { id: 4, name: "News Feed Refresh", status: "completed", lastRun: "5h ago", duration: "1.2s", type: "sync" },
  { id: 5, name: "Document Processing Queue", status: "pending", lastRun: "Queued", duration: "-", type: "process" },
  { id: 6, name: "Export Cache Cleanup", status: "completed", lastRun: "24h ago", duration: "0.8s", type: "maintenance" },
];

const SYSTEM_HEALTH = [
  { label: "API Response Time", value: "42ms", status: "good", target: "<100ms" },
  { label: "Database Queries", value: "1,247/min", status: "good", target: "<5000/min" },
  { label: "Cache Hit Rate", value: "94.2%", status: "good", target: ">85%" },
  { label: "Error Rate", value: "0.02%", status: "good", target: "<0.1%" },
  { label: "Storage Usage", value: "68%", status: "good", target: "<80%" },
  { label: "Memory Usage", value: "72%", status: "warning", target: "<70%" },
];

const STATUS_CONF: Record<string, { color: string; icon: any }> = {
  completed: { color: "text-green-600", icon: CheckCircle },
  running: { color: "text-blue-600", icon: Activity },
  pending: { color: "text-orange-600", icon: Clock },
  failed: { color: "text-red-600", icon: AlertTriangle },
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats } = useQuery<DashboardStats>({ queryKey: ['/api/dashboard/stats'] });
  const { data: componentsData } = useQuery<{ components: Component[] }>({ queryKey: ['/api/components', { limit: 5 }] });
  const { data: standardsData } = useQuery<{ standards: Standard[] }>({ queryKey: ['/api/standards', { limit: 5 }] });

  return (
    <Layout
      title="Admin Panel"
      subtitle="System administration, data management, and platform configuration"
      actions={
        <Button size="sm" className="gradient-railway text-white border-0 shadow-sm gap-2">
          <Download className="h-4 w-4" />
          System Report
        </Button>
      }
    >
      <div className="p-6 space-y-6 animate-fade-in">

        {/* System Health Banner */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {SYSTEM_HEALTH.map(h => (
            <div key={h.label} className={`rounded-xl p-3.5 border ${
              h.status === 'good' ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' :
              'bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900'
            }`}>
              <div className={`text-sm font-bold ${h.status === 'good' ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
                {h.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{h.label}</div>
              <div className="text-xs text-muted-foreground/70 mt-1">Target: {h.target}</div>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full bg-muted rounded-xl p-1">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="data" className="rounded-lg text-xs font-semibold">Data Manager</TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-lg text-xs font-semibold">System Jobs</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg text-xs font-semibold">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Database Stats */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Database Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Components", value: stats?.totalComponents || 24, color: "text-blue-600" },
                    { label: "Standards", value: stats?.totalStandards || 20, color: "text-green-600" },
                    { label: "Standard Clauses", value: 156, color: "text-purple-600" },
                    { label: "Suppliers", value: stats?.certifiedSuppliers || 8, color: "text-orange-600" },
                    { label: "Component-Standard Links", value: 97, color: "text-teal-600" },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    Recent Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { action: "Standards DB Updated", user: "admin", time: "2h ago" },
                    { action: "New Component Added", user: "admin", time: "4h ago" },
                    { action: "RAMS Scores Recalculated", user: "system", time: "6h ago" },
                    { action: "Export Generated", user: "admin", time: "1d ago" },
                    { action: "Document Indexed", user: "system", time: "1d ago" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground">{a.action}</div>
                        <div className="text-xs text-muted-foreground">{a.user} · {a.time}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { label: "Rebuild Search Index", icon: RefreshCw, color: "text-blue-600" },
                    { label: "Recalculate RAMS Scores", icon: BarChart3, color: "text-green-600" },
                    { label: "Sync Standards Database", icon: Database, color: "text-purple-600" },
                    { label: "Export Full Backup", icon: Download, color: "text-orange-600" },
                    { label: "Clear Cache", icon: RefreshCw, color: "text-red-600" },
                  ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <Button key={i} variant="outline" size="sm" className="w-full justify-start gap-2 h-9 text-xs">
                        <Icon className={`h-3.5 w-3.5 ${action.color}`} />
                        {action.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Manager Tab */}
          <TabsContent value="data" className="mt-5 space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Components */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Components</CardTitle>
                    <Button size="sm" className="h-7 text-xs gap-1 gradient-railway text-white border-0">
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {componentsData?.components?.slice(0, 5).map((comp: any) => (
                    <div key={comp.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{comp.name}</div>
                        <div className="text-xs text-muted-foreground">{comp.manufacturer}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )) || <div className="text-sm text-muted-foreground py-4 text-center">Loading...</div>}
                  <Button variant="outline" size="sm" className="w-full text-xs mt-2">View All Components</Button>
                </CardContent>
              </Card>

              {/* Standards */}
              <Card className="border-border shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Standards</CardTitle>
                    <Button size="sm" className="h-7 text-xs gap-1 gradient-railway text-white border-0">
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {standardsData?.standards?.slice(0, 5).map((std: any) => (
                    <div key={std.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground">{std.code}</div>
                        <div className="text-xs text-muted-foreground truncate">{std.title}</div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Badge variant="outline" className="text-xs mr-1">{std.category}</Badge>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )) || <div className="text-sm text-muted-foreground py-4 text-center">Loading...</div>}
                  <Button variant="outline" size="sm" className="w-full text-xs mt-2">View All Standards</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-5">
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">System Jobs</CardTitle>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {SYSTEM_JOBS.map(job => {
                    const conf = STATUS_CONF[job.status];
                    const Icon = conf.icon;
                    return (
                      <div key={job.id} className="flex items-center gap-4 p-3.5 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                        <Icon className={`h-4 w-4 flex-shrink-0 ${conf.color} ${job.status === 'running' ? 'animate-spin' : ''}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground">{job.name}</div>
                          <div className="text-xs text-muted-foreground">{job.lastRun}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{job.duration}</div>
                        <Badge variant="outline" className={`text-xs capitalize ${
                          job.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' :
                          job.status === 'running' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                          job.status === 'pending' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                          'border-gray-200 text-gray-600'
                        }`}>
                          {job.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-7 text-xs flex-shrink-0">
                          {job.status === 'pending' ? 'Run Now' : 'Re-run'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  title: "Platform Settings", icon: Settings,
                  fields: [
                    { label: "Platform Name", value: "Railway RAMS Intelligence Platform" },
                    { label: "Default Language", value: "English (EN)" },
                    { label: "Time Zone", value: "UTC+0 (CET)" },
                    { label: "News Refresh Schedule", value: "17:00 Daily (CET)" },
                  ]
                },
                {
                  title: "API Configuration", icon: Zap,
                  fields: [
                    { label: "API Version", value: "v1" },
                    { label: "Rate Limit", value: "1000 req/hour" },
                    { label: "Max Export Size", value: "50MB" },
                    { label: "Session Timeout", value: "8 hours" },
                  ]
                },
              ].map(section => {
                const Icon = section.icon;
                return (
                  <Card key={section.title} className="border-border shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Icon className="h-4 w-4 text-railway-blue" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.fields.map(f => (
                        <div key={f.label} className="flex flex-col gap-1">
                          <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                          <div className="text-sm text-foreground bg-muted/50 px-3 py-2 rounded-lg font-medium">{f.value}</div>
                        </div>
                      ))}
                      <Button size="sm" className="w-full mt-2 gradient-railway text-white border-0">
                        Update Settings
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
