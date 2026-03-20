import { useState, useRef } from "react";
import { Search, Mic, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ComponentSearchProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: any) => void;
  currentFilters: any;
}

const QUICK_TAGS = [
  "Traction Motors", "ETCS Level 2", "CBTC Systems", "Power Converters",
  "Fire Detection", "Door Controllers", "Brake Systems", "GSM-R Radio",
  "HVAC Units", "Platform Screen Doors", "Axle Counters", "Track Circuits",
  "Bogies", "Emergency Brake", "Passenger Info", "EN 50126", "EN 50155", "SIL 4"
];

const SUGGESTIONS = [
  "Siemens traction converter",
  "ABB power module SIL 3",
  "Alstom CBTC system",
  "Bombardier bogie assembly",
  "Thales ETCS onboard unit",
  "EN 50155 compliant inverter",
  "Fire detection system EN 45545",
];

export default function ComponentSearch({ onSearch, onFiltersChange, currentFilters }: ComponentSearchProps) {
  const [searchQuery, setSearchQuery] = useState(currentFilters?.search || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = searchQuery.length > 1
    ? SUGGESTIONS.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearch = (q?: string) => {
    const query = q ?? searchQuery;
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  const handleVoice = () => {
    setIsListening(!isListening);
    if (!isListening && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border p-5 mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search components by name, model, manufacturer, or standard..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-10 h-11 bg-muted/50 border-border focus:bg-background text-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Suggestions Dropdown */}
          {showSuggestions && filtered.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              {filtered.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => { setSearchQuery(s); handleSearch(s); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/60 flex items-center gap-2 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={() => handleSearch()}
          className="h-11 px-5 gradient-railway text-white border-0 shadow-sm gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Search
        </Button>

        <button
          onClick={handleVoice}
          title="Voice Search"
          className={`h-11 w-11 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
            isListening
              ? "gradient-danger text-white border-transparent animate-pulse shadow-md"
              : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-blue-300"
          }`}
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>

      {/* Quick Tags */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-muted-foreground font-medium py-1 mr-1">Quick:</span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => { setSearchQuery(tag); handleSearch(tag); }}
            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
              currentFilters?.search === tag
                ? "gradient-railway text-white border-transparent shadow-sm"
                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
