import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
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
    { icon: GraduationCap, title: "Beginner", unlocked: true, color: "text-green-600", bgColor: "bg-green-100" },
    { icon: Shield, title: "Defender", unlocked: false, color: "text-gray-400", bgColor: "bg-gray-100" },
    { icon: KeyRound, title: "Expert", unlocked: false, color: "text-gray-400", bgColor: "bg-gray-100" }
  ];

  const quickTools = [
    { 
      icon: Terminal, 
      title: "Command Helper", 
      description: "Quick reference guide", 
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      href: "/tools" 
    },
    { 
      icon: Bookmark, 
      title: "Bookmarks", 
      description: "Saved sections", 
      bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      iconColor: "text-yellow-600",
      href: "/modules" 
    },
    { 
      icon: ClipboardList, 
      title: "Cheat Sheets", 
      description: "Essential commands", 
      bgColor: "bg-gradient-to-br from-red-100 to-red-200",
      iconColor: "text-red-600",
      href: "/tools" 
    },
    { 
      icon: TrendingUp, 
      title: "Progress", 
      description: "Track your journey", 
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      iconColor: "text-purple-600",
      href: "/achievements" 
    }
  ];

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

  const modules = tutorials?.modules || [];

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader />
      
      <ProgressIndicator 
        currentModule={overallProgress.currentModule}
        totalModules={modules.length}
        percentage={overallProgress.percentage}
      />

      <main className="pb-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8 mx-4 mt-4 rounded-3xl shadow-lg border border-blue-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-green-100 border border-green-300 rounded-full px-4 py-2 mb-4 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-semibold">Live Training Environment</span>
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Master Ethical Hacking</h2>
            <p className="text-gray-600 text-lg">Hands-on cybersecurity tutorials with real-world labs</p>
          </div>
          
          {/* Achievement Badges */}
          <div className="flex justify-center space-x-6 mb-6">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${achievement.unlocked ? achievement.bgColor + ' shadow-lg' : 'bg-gray-100'} rounded-2xl flex items-center justify-center mb-2 transition-all duration-200`}>
                    <IconComponent className={`w-8 h-8 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{achievement.title}</p>
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
                progress={progress || undefined}
                index={index}
              />
            );
          })}
        </div>

        {/* Quick Tools Section */}
        <div className="px-4 pb-6">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Tools</h3>
          <div className="grid grid-cols-2 gap-4">
            {quickTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <Link key={index} href={tool.href}>
                  <Card className={`${tool.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-white/80 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm">
                        <IconComponent className={`w-6 h-6 ${tool.iconColor}`} />
                      </div>
                      <h4 className="font-bold mb-2 text-gray-800">{tool.title}</h4>
                      <p className="text-sm text-gray-600">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 z-40"
        size="icon"
      >
        <Play className="w-8 h-8 text-white" />
      </Button>

      <BottomNavigation />
    </div>
  );
}
