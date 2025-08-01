import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Search, Terminal, Network, Clock } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { Link } from "wouter";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const { searchResults, isSearching, searchTutorials } = useSearch();

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchTutorials(query);
    }
  }, [query, searchTutorials]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "module": return Network;
      case "lesson": return Terminal;
      case "section": return Terminal;
      default: return Terminal;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "module": return "text-[hsl(207,90%,54%)] bg-[hsl(207,90%,54%)]/20";
      case "lesson": return "text-[hsl(120,100%,50%)] bg-[hsl(120,100%,50%)]/20";
      case "section": return "text-[hsl(14,100%,60%)] bg-[hsl(14,100%,60%)]/20";
      default: return "text-[hsl(215,16%,47%)] bg-[hsl(215,16%,47%)]/20";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[hsl(240,10%,6%)]/90 search-overlay z-50 fade-in">
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search tutorials, commands, tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[hsl(227,39%,23%)] border border-[hsl(120,100%,50%)]/30 rounded-lg px-4 py-3 pl-10 text-white placeholder-[hsl(215,16%,47%)] focus:outline-none focus:border-[hsl(120,100%,50%)]"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(215,16%,47%)]" />
          </div>
          <Button 
            onClick={onClose}
            className="p-3 rounded-lg bg-[hsl(227,39%,23%)] hover:bg-[hsl(240,10%,6%)] transition-colors"
            size="sm"
          >
            <X className="w-4 h-4 text-[hsl(120,100%,50%)]" />
          </Button>
        </div>
        
        {/* Search Results */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {query.trim().length === 0 && (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-[hsl(215,16%,47%)] mx-auto mb-4 opacity-50" />
              <p className="text-[hsl(215,16%,47%)]">Start typing to search tutorials...</p>
            </div>
          )}

          {query.trim().length > 0 && query.trim().length < 2 && (
            <div className="text-center py-8">
              <p className="text-[hsl(215,16%,47%)]">Type at least 2 characters to search</p>
            </div>
          )}

          {isSearching && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(120,100%,50%)] mx-auto"></div>
              <p className="text-[hsl(215,16%,47%)] mt-2">Searching...</p>
            </div>
          )}

          {query.trim().length >= 2 && !isSearching && searchResults.length === 0 && (
            <div className="text-center py-8">
              <Terminal className="w-12 h-12 text-[hsl(215,16%,47%)] mx-auto mb-4 opacity-50" />
              <p className="text-[hsl(215,16%,47%)]">No results found for "{query}"</p>
              <p className="text-sm text-[hsl(215,16%,47%)] mt-2">
                Try different keywords or browse modules directly
              </p>
            </div>
          )}

          {searchResults.map((result, index) => {
            const IconComponent = getTypeIcon(result.type);
            const colorClasses = getTypeColor(result.type);
            const href = result.type === "module" 
              ? `/tutorial/${result.moduleId}` 
              : result.lessonId 
                ? `/tutorial/${result.moduleId}/${result.lessonId}`
                : `/tutorial/${result.moduleId}`;

            return (
              <Link key={index} href={href}>
                <Card 
                  className="bg-[hsl(227,39%,23%)]/50 rounded-lg border border-[hsl(120,100%,50%)]/10 hover:border-[hsl(120,100%,50%)]/30 transition-colors cursor-pointer"
                  onClick={onClose}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1 truncate">{result.title}</h4>
                        <p className="text-sm text-[hsl(215,16%,47%)] mb-2 line-clamp-2">
                          {result.description}
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {result.type}
                          </Badge>
                          {result.content && (
                            <div className="text-xs bg-[hsl(240,10%,6%)] px-2 py-1 rounded font-mono text-[hsl(120,100%,50%)] truncate max-w-32">
                              {result.content.substring(0, 20)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
