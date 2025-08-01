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

  const getCategoryColor = (category: string) => {
    const colors = {
      milestone: "from-blue-100 to-blue-200 border-blue-300",
      skill: "from-green-100 to-green-200 border-green-300", 
      challenge: "from-yellow-100 to-yellow-200 border-yellow-300",
      mastery: "from-red-100 to-red-200 border-red-300",
      habit: "from-purple-100 to-purple-200 border-purple-300"
    };
    return colors[category as keyof typeof colors] || "from-gray-100 to-gray-200 border-gray-300";
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: "text-gray-600",
      uncommon: "text-green-600",
      rare: "text-blue-600", 
      legendary: "text-purple-600"
    };
    return colors[rarity as keyof typeof colors] || "text-gray-600";
  };

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

  const getOldRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "text-gray-400 border-gray-400/20";
      case "uncommon": return "text-green-500 border-green-500/20";
      case "rare": return "text-blue-500 border-blue-500/20";
      case "epic": return "text-purple-500 border-purple-500/20";
      case "legendary": return "text-red-500 border-red-500/20";
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
    <div className="min-h-screen pb-20">
      <MobileHeader />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 px-4 py-8 mx-4 mt-4 rounded-3xl shadow-lg border border-purple-200">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Achievements</h1>
        <p className="text-gray-600 text-lg">Track your progress and unlock rewards</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="bg-white/80 border-purple-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-bold text-gray-800">{stats.totalEarned}</span>
              </div>
              <div className="text-xs text-gray-600">Achievements Earned</div>
              <Progress value={(stats.totalEarned / stats.totalAvailable) * 100} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 border-blue-200 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="w-5 h-5 text-blue-500" />
                <span className="text-lg font-bold text-gray-800">{stats.totalPoints}</span>
              </div>
              <div className="text-xs text-gray-600">Total Points</div>
              <div className="text-xs text-blue-600 font-medium mt-1">Level {stats.level}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <main className="px-4 py-6">
        {/* Achievement Categories */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Achievements</h2>
          
          <div className="space-y-4">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const CategoryIcon = getCategoryIcon(achievement.category);
              const categoryColors = getCategoryColor(achievement.category);
              const rarityStyles = getRarityColor(achievement.rarity);
              
              return (
                <Card 
                  key={achievement.id} 
                  className={`bg-gradient-to-r ${categoryColors} shadow-lg border-0 ${
                    achievement.earned 
                      ? "opacity-100" 
                      : "opacity-60"
                  } transition-all duration-200 hover:shadow-xl`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        achievement.earned 
                          ? "bg-white/90 shadow-lg" 
                          : "bg-white/50"
                      }`}>
                        <IconComponent className={`w-8 h-8 ${
                          achievement.earned ? rarityStyles.split(' ')[0] : "text-gray-400"
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                          {achievement.earned && (
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              Earned ✓
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {achievement.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs">
                            <div className="flex items-center space-x-1 text-gray-600">
                              <CategoryIcon className="w-3 h-3" />
                              <span className="capitalize">{achievement.category}</span>
                            </div>
                            
                            <Badge variant="outline" className={`text-xs ${rarityStyles} capitalize border-current`}>
                              {achievement.rarity}
                            </Badge>
                            
                            <div className="flex items-center space-x-1 text-gray-600">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{achievement.points} pts</span>  
                            </div>
                          </div>
                          
                          {achievement.earned && achievement.earnedDate && (
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
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
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-xl text-gray-800">Progress Overview</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Modules Completed</span>
                  <span className="font-bold text-gray-800">{progress.currentModule}/{progress.totalModules}</span>
                </div>
                <Progress value={progress.percentage} className="h-3" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Current Level</span>
                  <span className="font-bold text-blue-600">Level {stats.level}</span>
                </div>
                <Progress value={(stats.totalPoints % 500) / 5} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Next achievement in progress...</span>
                <span>Keep learning!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
