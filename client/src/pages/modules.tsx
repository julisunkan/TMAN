import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import ModuleCard from "@/components/tutorial/module-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Filter,
  Clock,
  Users,
  Award
} from "lucide-react";
import { TutorialModule } from "@shared/schema";
import { useProgress } from "@/hooks/use-progress";
import { useState } from "react";

export default function Modules() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: tutorials, isLoading } = useQuery<{modules: TutorialModule[]}>({
    queryKey: ["/api/tutorials"],
  });

  const { getModuleProgress } = useProgress();

  const modules = tutorials?.modules || [];
  const categories = ["all", "intro", "intermediate", "advanced", "tools"];
  
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: modules.length,
    completed: modules.filter(m => {
      const progress = getModuleProgress(m.id);
      return progress?.completed;
    }).length,
    totalTime: modules.reduce((sum, m) => sum + m.estimatedTime, 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(240,10%,6%)]">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(120,100%,50%)]"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(240,10%,6%)] pb-20">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">All Modules</h1>
        <p className="text-[hsl(215,16%,47%)]">Comprehensive cybersecurity training curriculum</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="bg-[hsl(240,6%,10%)]/50 border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-[hsl(207,90%,54%)]">{stats.total}</div>
              <div className="text-xs text-[hsl(215,16%,47%)]">Total Modules</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(240,6%,10%)]/50 border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{stats.completed}</div>
              <div className="text-xs text-[hsl(215,16%,47%)]">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(240,6%,10%)]/50 border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-[hsl(14,100%,60%)]">{stats.totalTime}h</div>
              <div className="text-xs text-[hsl(215,16%,47%)]">Total Time</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(215,16%,47%)]" />
          <Input
            placeholder="Search modules, tags, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[hsl(227,39%,23%)] border-[hsl(120,100%,50%)]/30 focus:border-[hsl(120,100%,50%)]"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-[hsl(120,100%,50%)] text-[hsl(240,10%,6%)]"
                  : "border-[hsl(240,3.7%,15.9%)] hover:border-[hsl(120,100%,50%)]/50"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div className="px-4 pb-6 space-y-4">
        {filteredModules.length === 0 ? (
          <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-8 text-center">
              <div className="text-[hsl(215,16%,47%)] mb-2">No modules found</div>
              <p className="text-sm text-[hsl(215,16%,47%)]">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredModules.map((module, index) => {
            const progress = getModuleProgress(module.id);
            return (
              <ModuleCard 
                key={module.id} 
                module={module} 
                progress={progress}
                index={index}
                showCategory
              />
            );
          })
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
