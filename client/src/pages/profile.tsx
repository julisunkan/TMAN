import MobileHeader from "@/components/layout/mobile-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Calendar, 
  Clock, 
  Trophy, 
  Target, 
  TrendingUp,
  Settings,
  Download,
  Share2,
  Award,
  BookOpen,
  Zap
} from "lucide-react";
import { useProgress } from "@/hooks/use-progress";

export default function Profile() {
  const { getOverallProgress, getRecentActivity } = useProgress();
  const progress = getOverallProgress();
  const recentActivity = getRecentActivity();

  const profileStats = {
    joinDate: "January 2024",
    totalHours: 12.5,
    streak: 7,
    level: 3,
    nextLevelPoints: 500,
    currentPoints: 350
  };

  const skillBadges = [
    { name: "Network Analysis", level: "Intermediate", color: "bg-[hsl(207,90%,54%)]/20 text-[hsl(207,90%,54%)]" },
    { name: "Packet Crafting", level: "Beginner", color: "bg-[hsl(120,100%,50%)]/20 text-[hsl(120,100%,50%)]" },
    { name: "Forensics", level: "Beginner", color: "bg-[hsl(120,100%,50%)]/20 text-[hsl(120,100%,50%)]" },
    { name: "Security Testing", level: "Novice", color: "bg-gray-500/20 text-gray-400" }
  ];

  const learningStreak = [
    { day: "Mon", completed: true },
    { day: "Tue", completed: true },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: true },
    { day: "Sat", completed: true },
    { day: "Sun", completed: false }
  ];

  return (
    <div className="min-h-screen bg-[hsl(240,10%,6%)] pb-20">
      <MobileHeader />
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] px-4 py-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-[hsl(120,100%,50%)] to-[hsl(105,100%,55%)] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-[hsl(240,10%,6%)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Cyber Student</h1>
            <p className="text-[hsl(215,16%,47%)]">Ethical Hacking Enthusiast</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-[hsl(207,90%,54%)]/20 text-[hsl(207,90%,54%)] border-[hsl(207,90%,54%)]/30">
                Level {profileStats.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profileStats.totalHours}h studied
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-[hsl(120,100%,50%)]">{progress.currentModule}</div>
            <div className="text-xs text-[hsl(215,16%,47%)]">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[hsl(14,100%,60%)]">{profileStats.streak}</div>
            <div className="text-xs text-[hsl(215,16%,47%)]">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-[hsl(207,90%,54%)]">{profileStats.currentPoints}</div>
            <div className="text-xs text-[hsl(215,16%,47%)]">Points</div>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        {/* Progress Overview */}
        <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[hsl(207,90%,54%)]" />
              <span>Learning Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Overall Completion</span>
                <span className="text-sm font-medium">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Level Progress</span>
                <span className="text-sm font-medium">
                  {profileStats.currentPoints}/{profileStats.nextLevelPoints}
                </span>
              </div>
              <Progress value={(profileStats.currentPoints / profileStats.nextLevelPoints) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Learning Streak */}
        <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-[hsl(14,100%,60%)]" />
              <span>Learning Streak</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              {learningStreak.map((day, index) => (
                <div key={index} className="text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    day.completed 
                      ? "bg-[hsl(120,100%,50%)] text-[hsl(240,10%,6%)]" 
                      : "bg-[hsl(240,3.7%,15.9%)] text-[hsl(215,16%,47%)]"
                  }`}>
                    {day.completed ? "✓" : "○"}
                  </div>
                  <div className="text-xs text-[hsl(215,16%,47%)]">{day.day}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-[hsl(215,16%,47%)]">
              🔥 {profileStats.streak} days straight! Keep it up!
            </div>
          </CardContent>
        </Card>

        {/* Skill Badges */}
        <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-[hsl(14,100%,60%)]" />
              <span>Skills & Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {skillBadges.map((skill, index) => (
                <div key={index} className={`p-3 rounded-lg border ${skill.color.replace('text-', 'border-').replace('/20', '/20')}`}>
                  <div className="font-medium text-sm">{skill.name}</div>
                  <div className="text-xs opacity-80">{skill.level}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[hsl(120,100%,50%)]" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center py-4 text-[hsl(215,16%,47%)]">
                <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Start learning to see your activity here</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-[hsl(227,39%,23%)]/30 rounded-lg">
                  <div className="w-8 h-8 bg-[hsl(120,100%,50%)]/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-[hsl(120,100%,50%)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.title}</div>
                    <div className="text-xs text-[hsl(215,16%,47%)]">{activity.description}</div>
                  </div>
                  <div className="text-xs text-[hsl(215,16%,47%)]">{activity.timestamp}</div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
          <CardContent className="p-4 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Account Settings
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Progress
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              <Share2 className="w-4 h-4 mr-2" />
              Share Achievements
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-4 h-4 text-[hsl(215,16%,47%)]" />
              <span className="text-sm text-[hsl(215,16%,47%)]">
                Member since {profileStats.joinDate}
              </span>
            </div>
            
            <Separator className="my-3" />
            
            <div className="text-xs text-[hsl(215,16%,47%)] space-y-1">
              <p>Version 1.0.0</p>
              <p>© 2024 CyberLabs Academy</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}
