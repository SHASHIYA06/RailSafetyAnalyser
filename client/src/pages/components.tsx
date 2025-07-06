import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Train, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComponentSearch from "@/components/component-search";
import FilterSidebar from "@/components/filter-sidebar";
import ComponentCard from "@/components/component-card";
import RAMSDashboard from "@/components/rams-dashboard";
import { Link } from "wouter";

interface ComponentFilters {
  search?: string;
  category?: string;
  silLevel?: number;
  minRamsScore?: number;
  standardIds?: number[];
  sortBy?: string;
}

export default function ComponentsPage() {
  const [filters, setFilters] = useState<ComponentFilters>({});
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const { data: componentsData, isLoading } = useQuery({
    queryKey: ['/api/components', { ...filters, limit: pageSize, offset: currentPage * pageSize }],
    enabled: true
  });

  const { data: dashboardStats } = useQuery({
    queryKey: ['/api/dashboard/stats']
  });

  const handleFiltersChange = (newFilters: ComponentFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export/components?format=csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'railway_components.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

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
              <Link href="/" className="text-railway-blue font-medium border-b-2 border-railway-blue pb-1">
                Components
              </Link>
              <Link href="/standards" className="text-gray-600 hover:text-railway-blue transition-colors">
                Standards Library
              </Link>
              <Link href="/rams" className="text-gray-600 hover:text-railway-blue transition-colors">
                RAMS Analysis
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button onClick={handleExport} className="bg-railway-blue hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar 
              onFiltersChange={handleFiltersChange}
              dashboardStats={dashboardStats}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <ComponentSearch 
              onSearch={(search) => handleFiltersChange({ ...filters, search })}
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
            />

            {/* RAMS Dashboard Overview */}
            <RAMSDashboard stats={dashboardStats} />

            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-railway-dark">Search Results</h2>
                  <p className="text-gray-600">
                    {isLoading ? 'Loading...' : `Found ${componentsData?.total || 0} components matching your criteria`}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <select 
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-railway-blue"
                    value={filters.sortBy || 'relevance'}
                    onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="rams_score">Sort by RAMS Score</option>
                    <option value="sil_level">Sort by SIL Level</option>
                    <option value="updated">Sort by Update Date</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Component Results */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-railway-blue"></div>
                </div>
              ) : componentsData?.components.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 text-lg">No components found matching your criteria</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
                </div>
              ) : (
                componentsData?.components.map((component) => (
                  <ComponentCard key={component.id} component={component} />
                ))
              )}
            </div>

            {/* Load More Button */}
            {componentsData && componentsData.components.length > 0 && 
             componentsData.total > (currentPage + 1) * pageSize && (
              <div className="text-center py-6">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Load More Components
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
