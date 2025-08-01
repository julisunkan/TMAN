import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Play, 
  Lock, 
  Clock,
  BookOpen,
  Terminal,
  Zap
} from "lucide-react";
import { TutorialModule } from "@shared/schema";

interface ModuleProgress {
  percentage: number;
  completed: boolean;
  completedLessons: string[];
  currentLessonIndex: number;
}

interface ModuleCardProps {
  module: TutorialModule;
  progress?: ModuleProgress;
  index: number;
  showCategory?: boolean;
}

export default function ModuleCard({ module, progress, index, showCategory = false }: ModuleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isCompleted = progress?.completed || false;
  const isInProgress = (progress?.percentage || 0) > 0 && !isCompleted;
  const isLocked = false; // All modules are unlocked
  
  const getStatusColor = () => {
    if (isCompleted) return "border-green-300 bg-green-50";
    if (isInProgress) return "border-primary/30 bg-primary/5";
    return "border-border";
  };

  const getStatusIcon = () => {
    if (isCompleted) return { icon: Check, color: "text-white bg-green-500" };
    if (isInProgress) return { icon: Play, color: "text-white bg-primary" };
    return { icon: BookOpen, color: "text-white bg-gray-500" };
  };

  const getStatusText = () => {
    if (isCompleted) return { text: "Completed", color: "text-green-600" };
    if (isInProgress) return { text: "In Progress", color: "text-primary" };
    return { text: "Not Started", color: "text-gray-600" };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "intro": return "bg-green-100 text-green-700";
      case "intermediate": return "bg-blue-100 text-blue-700";
      case "advanced": return "bg-red-100 text-red-700";
      case "tools": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "hands-on": return Terminal;
      case "lab": return Zap;
      default: return BookOpen;
    }
  };

  const statusIcon = getStatusIcon();
  const statusText = getStatusText();
  const StatusIconComponent = statusIcon.icon;

  return (
    <Card className={`bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] rounded-xl border overflow-hidden transition-all duration-200 hover:scale-[1.02] ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusIcon.color}`}>
              <StatusIconComponent className={`w-5 h-5 ${isCompleted ? 'text-[hsl(240,10%,6%)]' : ''}`} />
            </div>
            <div>
              <h3 className="font-semibold">{module.title}</h3>
              <div className="flex items-center space-x-2">
                <p className={`text-xs ${statusText.color}`}>
                  Module {index + 1} • {statusText.text}
                </p>
                {showCategory && (
                  <Badge className={`text-xs ${getCategoryColor(module.category)} border-0`}>
                    {module.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[hsl(215,16%,47%)]">{module.estimatedTime} min</div>
            <div className={`text-xs ${progress ? statusText.color : 'text-[hsl(215,16%,47%)]'}`}>
              {progress ? `${Math.round(progress.percentage)}%` : '0%'}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-[hsl(215,16%,47%)] mb-4">{module.description}</p>
        
        {/* Progress bar for in-progress modules */}
        {isInProgress && (
          <div className="w-full bg-[hsl(240,10%,6%)] rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-[hsl(207,90%,54%)] to-[hsl(120,100%,50%)] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress?.percentage || 0}%` }}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {module.lessons.map((_, lessonIndex) => (
              <div 
                key={lessonIndex}
                className={`w-2 h-2 rounded-full ${
                  progress?.completedLessons.includes(module.lessons[lessonIndex].id)
                    ? 'bg-[hsl(120,100%,50%)]'
                    : isInProgress && lessonIndex === (progress?.currentLessonIndex || 0)
                      ? 'bg-[hsl(207,90%,54%)]'
                      : 'bg-gray-600'
                }`}
              />
            ))}
            <span className="text-xs text-[hsl(215,16%,47%)] ml-2">
              {module.lessons.length} lessons
            </span>
          </div>
          
          <Link href={`/tutorial/${module.id}`}>
            <Button 
              size="sm" 
              className={
                isCompleted 
                  ? "bg-[hsl(120,100%,50%)]/20 text-[hsl(120,100%,50%)] border border-[hsl(120,100%,50%)]/30 hover:bg-[hsl(120,100%,50%)]/30" 
                  : "bg-[hsl(207,90%,54%)] text-white hover:bg-[hsl(207,90%,64%)]"
              }
            >
              {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
            </Button>
          </Link>
        </div>
      </CardContent>
      
      {/* Expandable Content */}
      {isInProgress && (
        <div className="border-t border-[hsl(207,90%,54%)]/20 bg-[hsl(240,10%,6%)]/30">
          <Button
            variant="ghost"
            className="w-full p-4 text-left flex items-center justify-between hover:bg-[hsl(240,10%,6%)]/50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="text-sm font-medium">View Lessons</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-[hsl(207,90%,54%)]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[hsl(207,90%,54%)]" />
            )}
          </Button>
          
          {isExpanded && (
            <div className="px-4 pb-4 space-y-3 slide-up">
              {module.lessons.map((lesson, lessonIndex) => {
                const isLessonCompleted = progress?.completedLessons.includes(lesson.id);
                const isCurrentLesson = lessonIndex === (progress?.currentLessonIndex || 0);
                const LessonIcon = getLessonTypeIcon(lesson.type);
                
                return (
                  <div 
                    key={lesson.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      isLessonCompleted 
                        ? 'bg-[hsl(120,100%,50%)]/10 border border-[hsl(120,100%,50%)]/20'
                        : isCurrentLesson
                          ? 'bg-[hsl(207,90%,54%)]/10 border border-[hsl(207,90%,54%)]/30'
                          : 'bg-[hsl(227,39%,23%)]/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isLessonCompleted 
                        ? 'bg-[hsl(120,100%,50%)]'
                        : isCurrentLesson
                          ? 'bg-[hsl(207,90%,54%)] animate-pulse'
                          : 'bg-gray-600'
                    }`}>
                      {isLessonCompleted ? (
                        <Check className="w-3 h-3 text-[hsl(240,10%,6%)]" />
                      ) : isCurrentLesson ? (
                        <Play className="w-3 h-3 text-white" />
                      ) : (
                        <LessonIcon className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium">{lesson.title}</h5>
                      <p className="text-xs text-[hsl(215,16%,47%)]">{lesson.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <LessonIcon className="w-3 h-3 text-[hsl(215,16%,47%)]" />
                        <span className="text-xs text-[hsl(215,16%,47%)]">{lesson.type}</span>
                        <Clock className="w-3 h-3 text-[hsl(215,16%,47%)]" />
                        <span className="text-xs text-[hsl(215,16%,47%)]">{lesson.estimatedTime}min</span>
                      </div>
                    </div>
                    <div className={`text-xs ${
                      isLessonCompleted 
                        ? 'text-[hsl(120,100%,50%)]'
                        : isCurrentLesson
                          ? 'text-[hsl(207,90%,54%)]'
                          : 'text-[hsl(215,16%,47%)]'
                    }`}>
                      {isLessonCompleted ? "✓" : isCurrentLesson ? "Current" : "Locked"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
