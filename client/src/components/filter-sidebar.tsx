import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, RotateCcw, ChevronDown, ChevronUp, Database, BookOpen, Shield, Activity } from "lucide-react";

interface FilterSidebarProps {
  onFiltersChange: (filters: any) => void;
  dashboardStats?: any;
}

const SYSTEM_CATEGORIES = [
  {
    name: "Power & Electrical Systems",
    icon: "⚡",
    subcategories: ["Traction Control", "Power Conversion", "Auxiliary Power", "Power Distribution", "Rectifiers", "Inverters"]
  },
  {
    name: "Control & Signaling",
    icon: "📡",
    subcategories: ["Train Control", "CBTC", "ETCS", "Interlocking", "Level Crossings", "ATC Systems", "SCADA"]
  },
  {
    name: "Safety Systems",
    icon: "🛡️",
    subcategories: ["Fire Protection", "Emergency Braking", "Platform Safety", "Collision Avoidance", "ATP Systems"]
  },
  {
    name: "Communication Equipment",
    icon: "📻",
    subcategories: ["Train Radio", "Digital Radio", "GSM-R", "Data Communication", "Network Infrastructure"]
  },
  {
    name: "Mechanical Components",
    icon: "⚙️",
    subcategories: ["Door Systems", "Brake Systems", "Coupling Systems", "Suspension", "Wheelsets"]
  },
  {
    name: "Rolling Stock Systems",
    icon: "🚂",
    subcategories: ["Bogies & Running Gear", "Propulsion", "Interior Systems", "Exterior Systems", "Pantographs"]
  },
  {
    name: "HVAC Systems",
    icon: "🌡️",
    subcategories: ["Climate Control", "Control Systems", "Air Quality", "Energy Management"]
  },
  {
    name: "Passenger Information",
    icon: "ℹ️",
    subcategories: ["Display Systems", "Control Units", "Audio Systems", "Emergency Communication", "PIS Controllers"]
  },
  {
    name: "Infrastructure Systems",
    icon: "🏗️",
    subcategories: ["Track Circuits", "Train Detection", "Signaling Infrastructure", "Power Infrastructure", "Axle Counters"]
  },
  {
    name: "Platform Systems",
    icon: "🚪",
    subcategories: ["Platform Screen Doors", "Ventilation Systems", "Lighting", "Passenger Flow Control"]
  },
  {
    name: "Power Supply Infrastructure",
    icon: "🔋",
    subcategories: ["Substations", "Power Distribution", "Overhead Lines", "Third Rail", "UPS Systems"]
  }
];

const KEY_STANDARDS = [
  { id: 1, code: "EN 50126", name: "RAMS", color: "blue" },
  { id: 2, code: "EN 50155", name: "Rolling Stock", color: "green" },
  { id: 3, code: "EN 50121", name: "EMC", color: "purple" },
  { id: 5, code: "EN 50716", name: "Software", color: "indigo" },
  { id: 9, code: "EN 45545", name: "Fire Protection", color: "red" },
  { id: 12, code: "IEC 62443", name: "Cybersecurity", color: "orange" },
];

export default function FilterSidebar({ onFiltersChange, dashboardStats }: FilterSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSilLevel, setSelectedSilLevel] = useState<number | undefined>();
  const [selectedStandardIds, setSelectedStandardIds] = useState<number[]>([]);
  const [minRamsScore, setMinRamsScore] = useState([0]);
  const [systemsExpanded, setSystemsExpanded] = useState(true);
  const [standardsExpanded, setStandardsExpanded] = useState(true);

  const handleStandardToggle = (standardId: number, checked: boolean) => {
    const updated = checked
      ? [...selectedStandardIds, standardId]
      : selectedStandardIds.filter(id => id !== standardId);
    setSelectedStandardIds(updated);
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
    setMinRamsScore([0]);
    onFiltersChange({});
  };

  const hasActiveFilters = selectedCategory || selectedSilLevel !== undefined || selectedStandardIds.length > 0 || minRamsScore[0] > 0;

  const stats = [
    { label: "Total Components", value: dashboardStats?.totalComponents || 24, icon: Database, color: "text-blue-600" },
    { label: "EN Standards", value: dashboardStats?.totalStandards || 20, icon: BookOpen, color: "text-green-600" },
    { label: "Avg RAMS Score", value: `${Math.round(dashboardStats?.averageRAMSScore || 94)}%`, icon: Activity, color: "text-orange-600" },
    { label: "SIL 4 Certified", value: dashboardStats?.sil4Count || 6, icon: Shield, color: "text-purple-600" },
  ];

  return (
    <div className="space-y-4">
      {/* Database Stats */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Database className="h-4 w-4 text-railway-blue" />
            Platform Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-muted/50 rounded-xl p-3 text-center">
                  <Icon className={`h-4 w-4 mx-auto mb-1 ${stat.color}`} />
                  <div className="text-lg font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters Card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <Filter className="h-4 w-4 text-railway-blue" />
              Search Filters
            </CardTitle>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-200">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-5">

          {/* System Category */}
          <div>
            <button
              onClick={() => setSystemsExpanded(!systemsExpanded)}
              className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Railway System
              {systemsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {systemsExpanded && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 text-sm border border-border rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">All Systems</option>
                {SYSTEM_CATEGORIES.map(category => (
                  <optgroup key={category.name} label={`${category.icon} ${category.name}`}>
                    <option value={category.name}>{category.name} (All)</option>
                    {category.subcategories.map(sub => (
                      <option key={sub} value={sub}>↳ {sub}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </div>

          {/* SIL Level */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Safety Integrity Level
            </Label>
            <div className="grid grid-cols-3 gap-1.5">
              {["All", "0", "1", "2", "3", "4"].map((level) => {
                const isActive = level === "All" ? selectedSilLevel === undefined : selectedSilLevel === parseInt(level);
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedSilLevel(level === "All" ? undefined : parseInt(level))}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      isActive
                        ? "gradient-railway text-white border-transparent shadow-sm"
                        : "bg-background text-muted-foreground border-border hover:border-blue-300 hover:text-foreground"
                    }`}
                  >
                    {level === "All" ? "All" : `SIL ${level}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Standards */}
          <div>
            <button
              onClick={() => setStandardsExpanded(!standardsExpanded)}
              className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Key Standards
              {standardsExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {standardsExpanded && (
              <div className="space-y-2">
                {KEY_STANDARDS.map(standard => (
                  <label key={standard.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <Checkbox
                      id={`std-${standard.id}`}
                      checked={selectedStandardIds.includes(standard.id)}
                      onCheckedChange={(checked) => handleStandardToggle(standard.id, !!checked)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-semibold text-foreground group-hover:text-railway-blue transition-colors">
                        {standard.code}
                      </span>
                      <span className="text-xs text-muted-foreground">({standard.name})</span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* RAMS Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Min RAMS Score
              </Label>
              <span className="text-xs font-bold text-railway-blue">{minRamsScore[0]}%</span>
            </div>
            <Slider
              value={minRamsScore}
              onValueChange={setMinRamsScore}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <Button
              onClick={applyFilters}
              className="w-full gradient-railway text-white border-0 h-9 text-sm shadow-sm"
            >
              Apply Filters
            </Button>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="w-full h-9 text-sm gap-1.5"
              disabled={!hasActiveFilters}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tags */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-bold text-foreground">Quick Search</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {["ETCS", "CBTC", "Track Circuits", "Bogies", "Fire Detection", "Door Controllers", "Brake Systems", "HVAC", "Platform Doors", "Axle Counters", "SIL 4", "EN 50126"].map(tag => (
              <button
                key={tag}
                onClick={() => { setSelectedCategory(tag); onFiltersChange({ category: tag }); }}
                className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
