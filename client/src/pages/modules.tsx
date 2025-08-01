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
      <div className="min-h-screen">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 px-4 py-8 mx-4 mt-4 rounded-3xl shadow-lg border border-yellow-200">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">All Modules</h1>
        <p className="text-gray-600 text-lg">Comprehensive cybersecurity training curriculum</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="bg-white/80 border-yellow-200 shadow-lg">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Modules</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-green-200 shadow-lg">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-red-200 shadow-lg">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-red-600">{stats.totalTime}h</div>
              <div className="text-xs text-gray-600">Total Time</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="px-4 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search modules, tags, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-blue-500 shadow-sm"
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
              className={`whitespace-nowrap shadow-sm ${
                selectedCategory === category
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
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
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-gray-600 mb-2 text-lg font-medium">No modules found</div>
              <p className="text-sm text-gray-500">
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
