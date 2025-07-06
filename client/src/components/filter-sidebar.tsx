import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void;
  dashboardStats?: any;
}

export default function FilterSidebar({ onFiltersChange, dashboardStats }: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSilLevel, setSelectedSilLevel] = useState<number | undefined>();
  const [selectedStandardIds, setSelectedStandardIds] = useState<number[]>([]);
  const [minRamsScore, setMinRamsScore] = useState([70]);

  const { data: standardsData } = useQuery({
    queryKey: ['/api/standards', { limit: 100 }]
  });

  const categories = [
    "Power & Electrical Systems",
    "Control & Signaling", 
    "Safety Systems",
    "Communication Equipment",
    "Mechanical Components"
  ];

  const mainStandards = [
    { id: 1, code: "EN 50126", name: "RAMS" },
    { id: 2, code: "EN 50155", name: "Rolling Stock" },
    { id: 3, code: "EN 50121", name: "EMC" },
    { id: 4, code: "EN 50716", name: "Software" },
    { id: 5, code: "EN 45545", name: "Fire Protection" }
  ];

  const handleStandardToggle = (standardId: number, checked: boolean) => {
    const newSelectedStandards = checked 
      ? [...selectedStandardIds, standardId]
      : selectedStandardIds.filter(id => id !== standardId);
    
    setSelectedStandardIds(newSelectedStandards);
  };

  const applyFilters = () => {
    const filters: any = {};
    
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedSilLevel !== undefined) filters.silLevel = selectedSilLevel;
    if (selectedStandardIds.length > 0) filters.standardIds = selectedStandardIds;
    if (minRamsScore[0] > 0) filters.minRamsScore = minRamsScore[0];
    
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedSilLevel(undefined);
    setSelectedStandardIds([]);
    setMinRamsScore([70]);
    onFiltersChange({});
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-railway-dark">Search Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Component Category Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Component Category
            </Label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-railway-blue focus:border-railway-blue"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Standards Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Standards
            </Label>
            <div className="space-y-2">
              {mainStandards.map(standard => (
                <div key={standard.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`standard-${standard.id}`}
                    checked={selectedStandardIds.includes(standard.id)}
                    onCheckedChange={(checked) => handleStandardToggle(standard.id, !!checked)}
                  />
                  <Label 
                    htmlFor={`standard-${standard.id}`}
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    {standard.code} ({standard.name})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* SIL Level Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              SIL Level
            </Label>
            <select 
              value={selectedSilLevel ?? ""}
              onChange={(e) => setSelectedSilLevel(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-railway-blue focus:border-railway-blue"
            >
              <option value="">All SIL Levels</option>
              <option value="0">SIL 0</option>
              <option value="1">SIL 1</option>
              <option value="2">SIL 2</option>
              <option value="3">SIL 3</option>
              <option value="4">SIL 4</option>
            </select>
          </div>

          {/* RAMS Score Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Minimum RAMS Score
            </Label>
            <Slider
              value={minRamsScore}
              onValueChange={setMinRamsScore}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{minRamsScore[0]}</span>
              <span>100</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={applyFilters} className="w-full bg-railway-blue hover:bg-blue-700">
              Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-railway-dark">Database Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Components</span>
              <span className="font-semibold text-railway-dark">
                {dashboardStats?.totalComponents || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">EN Standards</span>
              <span className="font-semibold text-railway-dark">
                {dashboardStats?.totalStandards || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Certified Suppliers</span>
              <span className="font-semibold text-railway-dark">
                {dashboardStats?.certifiedSuppliers || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg RAMS Score</span>
              <span className="font-semibold text-railway-dark">
                {dashboardStats?.averageRAMSScore ? 
                  Math.round(dashboardStats.averageRAMSScore) : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
