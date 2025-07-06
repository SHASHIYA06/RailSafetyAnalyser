import { useState } from "react";
import { Search, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComponentSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  currentFilters: any;
}

const quickSearchTags = [
  "Traction Motors",
  "ETCS Systems", 
  "CBTC Systems",
  "Power Converters",
  "Fire Detection",
  "Door Controllers",
  "Brake Systems",
  "Signaling Equipment",
  "HVAC Systems",
  "Platform Doors",
  "Axle Counters",
  "Track Circuits",
  "Bogies",
  "Radio Systems",
  "Emergency Brake",
  "Passenger Info",
  "EN 50126",
  "EN 50155",
  "SIL 4 Components"
];

export default function ComponentSearch({ onSearch, onFiltersChange, currentFilters }: ComponentSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickSearch = (tag: string) => {
    setSearchQuery(tag);
    onSearch(tag);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search components by name, model, or standard..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="bg-railway-blue hover:bg-blue-700">
          Search
        </Button>
        <Button variant="outline" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Sliders className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Quick Search Tags */}
      <div className="flex flex-wrap gap-2">
        {quickSearchTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-blue-200 bg-blue-100 text-railway-blue"
            onClick={() => handleQuickSearch(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
