import { useQuery } from "@tanstack/react-query";
import MobileHeader from "@/components/layout/mobile-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import ProgressIndicator from "@/components/tutorial/progress-indicator";
import ModuleCard from "@/components/tutorial/module-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  Bookmark, 
  ClipboardList, 
  TrendingUp,
  Play,
  GraduationCap,
  Shield,
  KeyRound
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";
import { TutorialModule } from "@shared/schema";

export default function Home() {
  const { data: tutorials, isLoading } = useQuery<{modules: TutorialModule[]}>({
    queryKey: ["/api/tutorials"],
  });

  const { getOverallProgress, getModuleProgress } = useProgress();
  const overallProgress = getOverallProgress();

  const achievements = [
    { icon: GraduationCap, title: "Beginner", unlocked: true, color: "text-[hsl(120,100%,50%)]" },
    { icon: Shield, title: "Defender", unlocked: false, color: "text-gray-400" },
    { icon: KeyRound, title: "Expert", unlocked: false, color: "text-gray-400" }
  ];

  const quickTools = [
    { icon: Terminal, title: "Command Helper", description: "Quick reference guide", color: "border-[hsl(120,100%,50%)]/20 hover:border-[hsl(120,100%,50%)]/40" },
    { icon: Bookmark, title: "Bookmarks", description: "Saved sections", color: "border-[hsl(207,90%,54%)]/20 hover:border-[hsl(207,90%,54%)]/40" },
    { icon: ClipboardList, title: "Cheat Sheets", description: "Essential commands", color: "border-[hsl(14,100%,60%)]/20 hover:border-[hsl(14,100%,60%)]/40" },
    { icon: TrendingUp, title: "Progress", description: "Track your journey", color: "border-purple-400/20 hover:border-purple-400/40" }
  ];

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

  const modules = tutorials?.modules || [];

  return (
    <div className="min-h-screen bg-[hsl(240,10%,6%)] pb-20">
      <MobileHeader />
      
      <ProgressIndicator 
        currentModule={overallProgress.currentModule}
        totalModules={modules.length}
        percentage={overallProgress.percentage}
      />

      <main className="pb-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[hsl(227,39%,23%)] via-[hsl(240,10%,6%)] to-[hsl(227,39%,23%)] px-4 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-[hsl(120,100%,50%)]/10 border border-[hsl(120,100%,50%)]/30 rounded-full px-4 py-2 mb-4">
              <div className="w-2 h-2 bg-[hsl(120,100%,50%)] rounded-full animate-pulse"></div>
              <span className="text-sm text-[hsl(120,100%,50%)] font-medium">Live Training Environment</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Master Ethical Hacking</h2>
            <p className="text-[hsl(215,16%,47%)]">Hands-on cybersecurity tutorials with real-world labs</p>
          </div>
          
          {/* Achievement Badges */}
          <div className="flex justify-center space-x-4 mb-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 ${achievement.unlocked ? 'bg-gradient-to-r from-[hsl(120,100%,50%)] to-[hsl(105,100%,55%)] glow-effect' : 'bg-gray-600'} rounded-full flex items-center justify-center mb-2`}>
                    <IconComponent className={`w-6 h-6 ${achievement.unlocked ? 'text-[hsl(240,10%,6%)]' : achievement.color}`} />
                  </div>
                  <p className="text-xs text-[hsl(215,16%,47%)]">{achievement.title}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Module Cards */}
        <div className="px-4 py-6 space-y-4">
          {modules.map((module, index) => {
            const progress = getModuleProgress(module.id);
            return (
              <ModuleCard 
                key={module.id} 
                module={module} 
                progress={progress}
                index={index}
              />
            );
          })}
        </div>

        {/* Quick Tools Section */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold mb-4">Quick Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Card key={index} className={`bg-gradient-to-br from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] border ${tool.color} transition-colors cursor-pointer hover:scale-105 transform duration-200`}>
                  <CardContent className="p-4">
                    <div className="w-8 h-8 bg-[hsl(120,100%,50%)]/20 rounded-lg flex items-center justify-center mb-3">
                      <IconComponent className="w-4 h-4 text-[hsl(120,100%,50%)]" />
                    </div>
                    <h4 className="font-medium mb-1">{tool.title}</h4>
                    <p className="text-xs text-[hsl(215,16%,47%)]">{tool.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(120,100%,50%)] rounded-full shadow-lg hover:scale-110 transition-transform z-40"
        size="icon"
      >
        <Play className="w-6 h-6 text-[hsl(240,10%,6%)]" />
      </Button>

      <BottomNavigation />
    </div>
  );
}
