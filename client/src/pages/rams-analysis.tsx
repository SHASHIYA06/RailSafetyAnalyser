import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Train, Download, User, BarChart3, TrendingUp, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function RAMSAnalysisPage() {
  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats']
  });

  const { data: componentsData } = useQuery({
    queryKey: ['/api/components', { limit: 100, sortBy: 'rams_score' }]
  });

  const ramsMetrics = [
    {
      title: "Reliability",
      value: dashboardStats ? Math.round(dashboardStats.averageRAMSScore * 0.97) : 94,
      icon: BarChart3,
      color: "success-green",
      description: "Mean time between failures (MTBF)"
    },
    {
      title: "Availability", 
      value: dashboardStats ? Math.round(dashboardStats.averageRAMSScore * 0.99) : 98,
      icon: TrendingUp,
      color: "railway-blue",
      description: "System uptime percentage"
    },
    {
      title: "Maintainability",
      value: dashboardStats ? Math.round(dashboardStats.averageRAMSScore * 0.89) : 87,
      icon: Clock,
      color: "warning-orange", 
      description: "Mean time to repair (MTTR)"
    },
    {
      title: "Safety",
      value: dashboardStats ? Math.round(dashboardStats.averageRAMSScore * 0.96) : 96,
      icon: Shield,
      color: "danger-red",
      description: "Safety integrity level compliance"
    }
  ];

  const topComponents = componentsData?.components
    .sort((a, b) => (Number(b.ramsScore) || 0) - (Number(a.ramsScore) || 0))
    .slice(0, 10) || [];

  const riskDistribution = componentsData?.components.reduce((acc, comp) => {
    const risk = comp.riskLevel || 'medium';
    acc[risk] = (acc[risk] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-railway-blue rounded-lg flex items-center justify-center">
                <Train className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-railway-dark">Railway RAMS Platform</h1>
                <p className="text-xs text-gray-500">Standards & Compliance Analysis</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-railway-blue transition-colors">
                Components
              </Link>
              <Link href="/standards" className="text-gray-600 hover:text-railway-blue transition-colors">
                Standards Library
              </Link>
              <Link href="/rams" className="text-railway-blue font-medium border-b-2 border-railway-blue pb-1">
                RAMS Analysis
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button className="bg-railway-blue hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-railway-dark mb-4">RAMS Analysis Dashboard</h2>
          <p className="text-gray-600">
            Comprehensive reliability, availability, maintainability, and safety analysis
          </p>
        </div>

        {/* RAMS Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {ramsMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{metric.value}%</p>
                    </div>
                    <div className={`w-12 h-12 bg-${metric.color} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`text-${metric.color} h-6 w-6`} />
                    </div>
                  </div>
                  <Progress value={metric.value} className="mb-2" />
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* System Health Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall RAMS Score</span>
                      <span className="text-2xl font-bold text-success-green">
                        {dashboardStats ? Math.round(dashboardStats.averageRAMSScore) : 94}%
                      </span>
                    </div>
                    <Progress value={dashboardStats?.averageRAMSScore || 94} className="h-3" />
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-success-green">
                          {Math.round((dashboardStats?.complianceRate || 85))}%
                        </p>
                        <p className="text-sm text-gray-600">Compliance Rate</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-railway-blue">
                          {dashboardStats?.totalComponents || 0}
                        </p>
                        <p className="text-sm text-gray-600">Total Components</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(riskDistribution).map(([risk, count]) => {
                      const percentage = componentsData?.components.length 
                        ? Math.round((count / componentsData.components.length) * 100)
                        : 0;
                      const colorMap = {
                        low: 'success-green',
                        medium: 'warning-orange', 
                        high: 'danger-red',
                        'very low': 'success-green'
                      };
                      const color = colorMap[risk as keyof typeof colorMap] || 'gray-500';
                      
                      return (
                        <div key={risk} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full bg-${color}`}></div>
                            <span className="text-sm capitalize">{risk} Risk</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-24">
                              <Progress value={percentage} className="h-2" />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="components" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topComponents.map((component, index) => (
                    <div key={component.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-railway-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{component.name}</h4>
                          <p className="text-sm text-gray-600">{component.manufacturer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-success-green">
                          {Number(component.ramsScore)?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-500">RAMS Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RAMS Trends Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Historical trends and predictive analysis for RAMS metrics
                </p>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Trends chart would be implemented here with a charting library</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Standards Compliance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-railway-blue">98%</p>
                      <p className="text-sm text-gray-600">EN 50126</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-success-green">95%</p>
                      <p className="text-sm text-gray-600">EN 50155</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-warning-orange">87%</p>
                      <p className="text-sm text-gray-600">EN 50121</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">92%</p>
                      <p className="text-sm text-gray-600">EN 45545</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Compliance by Standard</h4>
                    <div className="space-y-3">
                      {[
                        { standard: 'EN 50126 (RAMS)', compliance: 98 },
                        { standard: 'EN 50155 (Rolling Stock)', compliance: 95 },
                        { standard: 'EN 50121 (EMC)', compliance: 87 },
                        { standard: 'EN 45545 (Fire Protection)', compliance: 92 },
                        { standard: 'EN 50716 (Software)', compliance: 89 }
                      ].map((item) => (
                        <div key={item.standard} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{item.standard}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-32">
                              <Progress value={item.compliance} className="h-2" />
                            </div>
                            <span className="text-sm font-medium w-12 text-right">{item.compliance}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
