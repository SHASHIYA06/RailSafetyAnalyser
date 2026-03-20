import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/layout";
import ComponentSearch from "@/components/component-search";
import FilterSidebar from "@/components/filter-sidebar";
import ComponentCard from "@/components/component-card";

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
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const pageSize = 20;

  const { data: componentsData, isLoading } = useQuery({
    queryKey: ['/api/components', { ...filters, limit: pageSize, offset: currentPage * pageSize }],
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

  const total = componentsData?.total || 0;
  const components = componentsData?.components || [];

  return (
    <Layout
      title="Component Search"
      subtitle="Search railway components with RAMS compliance and standards mapping"
      actions={
        <Button onClick={handleExport} size="sm" className="gradient-railway text-white border-0 shadow-sm gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      }
    >
      <div className="p-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <FilterSidebar
              onFiltersChange={handleFiltersChange}
              dashboardStats={dashboardStats}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Search */}
            <ComponentSearch
              onSearch={(search) => handleFiltersChange({ ...filters, search })}
              onFiltersChange={handleFiltersChange}
              currentFilters={filters}
            />

            {/* Results Header */}
            <div className="bg-white dark:bg-card rounded-2xl border border-border shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    {isLoading ? 'Searching...' : (
                      <>
                        <span className="text-railway-blue">{total}</span> component{total !== 1 ? 's' : ''} found
                      </>
                    )}
                  </h2>
                  {Object.keys(filters).filter(k => filters[k as keyof ComponentFilters]).length > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">Filtered by:</span>
                      {filters.category && <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{filters.category}</Badge>}
                      {filters.silLevel !== undefined && <Badge variant="outline" className="text-xs">SIL {filters.silLevel}</Badge>}
                      {filters.minRamsScore && <Badge variant="outline" className="text-xs">Min Score: {filters.minRamsScore}%</Badge>}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.sortBy || 'relevance'}
                    onChange={(e) => handleFiltersChange({ ...filters, sortBy: e.target.value })}
                  >
                    <option value="relevance">Sort by Relevance</option>
                    <option value="rams_score">Sort by RAMS Score</option>
                    <option value="sil_level">Sort by SIL Level</option>
                    <option value="updated">Sort by Updated</option>
                  </select>

                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-railway-blue text-white' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-railway-blue text-white' : 'bg-background text-muted-foreground hover:bg-muted'}`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Component Results */}
            {isLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-white dark:bg-card rounded-2xl border border-border p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-2xl flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-1/3" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                        <div className="h-3 bg-muted rounded w-2/3 mt-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : components.length === 0 ? (
              <div className="bg-white dark:bg-card rounded-2xl border border-border p-16 text-center">
                <SlidersHorizontal className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No components found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleFiltersChange({})}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : 'space-y-4'}>
                {components.map((component: any) => (
                  <ComponentCard key={component.id} component={component} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {components.length > 0 && total > (currentPage + 1) * pageSize && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-8"
                >
                  Load More Components ({total - (currentPage + 1) * pageSize} remaining)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
