import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { TutorialService } from "@/lib/tutorial-service";
import { SearchResult } from "@shared/schema";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Use React Query for caching search results
  const { data: searchResults = [], refetch } = useQuery<SearchResult[]>({
    queryKey: ["/api/search", searchQuery],
    queryFn: () => TutorialService.searchTutorials(searchQuery),
    enabled: false, // Don't auto-fetch
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  });

  const searchTutorials = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchQuery("");
      return;
    }

    setIsSearching(true);
    setSearchQuery(query.trim());
    
    try {
      await refetch();
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [refetch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setIsSearching(false);
  }, []);

  // Get search suggestions based on current query
  const getSearchSuggestions = useCallback((query: string): string[] => {
    if (!query || query.length < 1) return [];
    
    const commonTerms = [
      "nmap", "wireshark", "hping3", "metasploit", "burp suite",
      "sql injection", "xss", "csrf", "buffer overflow", "privilege escalation",
      "reconnaissance", "enumeration", "exploitation", "post-exploitation",
      "network scanning", "web application", "wireless security",
      "social engineering", "password cracking", "forensics"
    ];

    return commonTerms
      .filter(term => term.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, []);

  // Get popular searches (could be enhanced with actual analytics)
  const getPopularSearches = useCallback((): string[] => {
    return [
      "network scanning",
      "packet crafting", 
      "web vulnerabilities",
      "privilege escalation",
      "social engineering",
      "wireless attacks",
      "forensics tools"
    ];
  }, []);

  // Search within specific module
  const searchInModule = useCallback(async (moduleId: string, query: string): Promise<SearchResult[]> => {
    if (!query || query.trim().length < 2) return [];

    try {
      const allResults = await TutorialService.searchTutorials(query);
      return allResults.filter(result => result.moduleId === moduleId);
    } catch (error) {
      console.error("Module search error:", error);
      return [];
    }
  }, []);

  // Advanced search with filters
  const advancedSearch = useCallback(async (options: {
    query: string;
    category?: string;
    type?: "module" | "lesson" | "section";
    tags?: string[];
  }): Promise<SearchResult[]> => {
    if (!options.query || options.query.trim().length < 2) return [];

    try {
      let results = await TutorialService.searchTutorials(options.query);
      
      // Apply filters
      if (options.type) {
        results = results.filter(r => r.type === options.type);
      }
      
      // Additional filtering could be added here based on tags, category, etc.
      
      return results;
    } catch (error) {
      console.error("Advanced search error:", error);
      return [];
    }
  }, []);

  // Save search history (localStorage)
  const saveSearchHistory = useCallback((query: string) => {
    if (!query || query.trim().length < 2) return;
    
    try {
      const history = getSearchHistory();
      const updatedHistory = [
        query.trim(),
        ...history.filter(h => h !== query.trim())
      ].slice(0, 10); // Keep only last 10 searches
      
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  }, []);

  const getSearchHistory = useCallback((): string[] => {
    try {
      const stored = localStorage.getItem("searchHistory");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading search history:", error);
      return [];
    }
  }, []);

  const clearSearchHistory = useCallback(() => {
    try {
      localStorage.removeItem("searchHistory");
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  }, []);

  // Highlight search terms in text
  const highlightSearchTerms = useCallback((text: string, query: string): string => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 text-black">$1</mark>');
  }, []);

  // Get search analytics
  const getSearchStats = useCallback(() => {
    const history = getSearchHistory();
    return {
      totalSearches: history.length,
      recentSearches: history.slice(0, 5),
      topSearchTerms: history.reduce((acc, term) => {
        acc[term] = (acc[term] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [getSearchHistory]);

  return {
    // State
    searchQuery,
    searchResults,
    isSearching,
    
    // Actions
    searchTutorials,
    clearSearch,
    
    // Suggestions and recommendations
    getSearchSuggestions,
    getPopularSearches,
    
    // Advanced search
    searchInModule,
    advancedSearch,
    
    // History management
    saveSearchHistory,
    getSearchHistory,
    clearSearchHistory,
    
    // Utilities
    highlightSearchTerms,
    getSearchStats,
  };
}
