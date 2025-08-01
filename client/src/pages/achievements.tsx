import MobileHeader from "@/components/layout/mobile-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Award, 
  Target, 
  Zap, 
  Shield, 
  Star,
  Calendar,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";

export default function Achievements() {
  const { getOverallProgress } = useProgress();
  const progress = getOverallProgress();

  const achievements = [
    {
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first tutorial module",
      icon: Trophy,
      earned: true,
      earnedDate: "2024-01-15",
      category: "milestone",
      points: 100,
      rarity: "common"
    },
    {
      id: "network-ninja",
      title: "Network Ninja", 
      description: "Master 5 network analysis techniques",
      icon: Shield,
      earned: true,
      earnedDate: "2024-01-20",
      category: "skill",
      points: 250,
      rarity: "uncommon"
    },
    {
      id: "speed-learner",
      title: "Speed Learner",
      description: "Complete 3 modules in one day",
      icon: Zap,
      earned: false,
      category: "challenge",
      points: 500,
      rarity: "rare"
    },
    {
      id: "forensics-expert",
      title: "Forensics Expert",
      description: "Complete all forensics modules with 100% score",
      icon: Target,
      earned: false,
      category: "mastery",
      points: 1000,
      rarity: "legendary"
    },
    {
      id: "consistent-learner",
      title: "Consistent Learner",
      description: "Study for 7 consecutive days",
      icon: Calendar,
      earned: false,
      category: "habit",
      points: 300,
      rarity: "uncommon"
    },
    {
      id: "tool-master",
      title: "Tool Master",
      description: "Use all security tools in practice",
      icon: Award,
      earned: false,
      category: "skill",
      points: 750,
      rarity: "epic"
    }
  ];

  const stats = {
    totalEarned: achievements.filter(a => a.earned).length,
    totalAvailable: achievements.length,
    totalPoints: achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0),
    level: Math.floor(achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0) / 500) + 1
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400 border-gray-400/20";
      case "uncommon": return "text-[hsl(120,100%,50%)] border-[hsl(120,100%,50%)]/20";
      case "rare": return "text-[hsl(207,90%,54%)] border-[hsl(207,90%,54%)]/20";
      case "epic": return "text-purple-400 border-purple-400/20";
      case "legendary": return "text-[hsl(14,100%,60%)] border-[hsl(14,100%,60%)]/20";
      default: return "text-gray-400 border-gray-400/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "milestone": return Trophy;
      case "skill": return Target;
      case "challenge": return Zap;
      case "mastery": return Award;
      case "habit": return Calendar;
      default: return Star;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(240,10%,6%)] pb-20">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Achievements</h1>
        <p className="text-[hsl(215,16%,47%)]">Track your progress and unlock rewards</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="bg-[hsl(240,6%,10%)]/50 border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-[hsl(120,100%,50%)]" />
                <span className="text-lg font-bold">{stats.totalEarned}</span>
              </div>
              <div className="text-xs text-[hsl(215,16%,47%)]">Achievements Earned</div>
              <Progress value={(stats.totalEarned / stats.totalAvailable) * 100} className="h-1 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-[hsl(240,6%,10%)]/50 border-[hsl(240,3.7%,15.9%)]">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-[hsl(14,100%,60%)]" />
                <span className="text-lg font-bold">{stats.totalPoints}</span>
              </div>
              <div className="text-xs text-[hsl(215,16%,47%)]">Total Points</div>
              <div className="text-xs text-[hsl(207,90%,54%)] mt-1">Level {stats.level}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <main className="px-4 py-6">
        {/* Achievement Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Your Achievements</h2>
          
          <div className="space-y-3">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const CategoryIcon = getCategoryIcon(achievement.category);
              const rarityStyles = getRarityColor(achievement.rarity);
              
              return (
                <Card 
                  key={achievement.id} 
                  className={`bg-[hsl(240,6%,10%)] border ${
                    achievement.earned 
                      ? "border-[hsl(120,100%,50%)]/30 bg-[hsl(120,100%,50%)]/5" 
                      : "border-[hsl(240,3.7%,15.9%)] opacity-60"
                  } transition-all duration-200`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        achievement.earned 
                          ? "bg-[hsl(120,100%,50%)]/20 glow-effect" 
                          : "bg-gray-600"
                      }`}>
                        <IconComponent className={`w-6 h-6 ${
                          achievement.earned ? "text-[hsl(120,100%,50%)]" : "text-gray-400"
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.earned && (
                            <Badge className="bg-[hsl(120,100%,50%)]/20 text-[hsl(120,100%,50%)] border-[hsl(120,100%,50%)]/30">
                              Earned
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-[hsl(215,16%,47%)] mb-2">
                          {achievement.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1">
                              <CategoryIcon className="w-3 h-3" />
                              <span className="capitalize">{achievement.category}</span>
                            </div>
                            
                            <Badge variant="outline" className={`text-xs ${rarityStyles} capitalize`}>
                              {achievement.rarity}
                            </Badge>
                            
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-[hsl(14,100%,60%)]" />
                              <span>{achievement.points} pts</span>  
                            </div>
                          </div>
                          
                          {achievement.earned && achievement.earnedDate && (
                            <div className="text-xs text-[hsl(215,16%,47%)] flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(achievement.earnedDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,6%,10%)] border-[hsl(120,100%,50%)]/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[hsl(207,90%,54%)]" />
              <h3 className="font-semibold">Progress Overview</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Modules Completed</span>
                  <span className="font-medium">{progress.currentModule}/{progress.totalModules}</span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Current Level</span>
                  <span className="font-medium text-[hsl(207,90%,54%)]">Level {stats.level}</span>
                </div>
                <Progress value={(stats.totalPoints % 500) / 5} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-[hsl(240,3.7%,15.9%)] text-xs text-[hsl(215,16%,47%)]">
              <div className="flex justify-between">
                <span>Next achievement in progress...</span>
                <span>Keep learning! 🎯</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
