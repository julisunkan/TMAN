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
    <Card className={`bg-white rounded-2xl border shadow-lg overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl ${getStatusColor()}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${statusIcon.color} shadow-md`}>
              <StatusIconComponent className={`w-6 h-6 ${isCompleted ? 'text-white' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{module.title}</h3>
              <div className="flex items-center space-x-2">
                <p className={`text-sm ${statusText.color} font-medium`}>
                  Module {index + 1} • {statusText.text}
                </p>
                {showCategory && (
                  <Badge className={`text-xs ${getCategoryColor(module.category)} border-0 font-medium`}>
                    {module.category}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 font-medium">{module.estimatedTime} min</div>
            <div className={`text-sm font-bold ${progress ? statusText.color : 'text-gray-500'}`}>
              {progress ? `${Math.round(progress.percentage)}%` : '0%'}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{module.description}</p>
        
        {/* Progress bar for in-progress modules */}
        {isInProgress && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300 shadow-sm" 
              style={{ width: `${progress?.percentage || 0}%` }}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2 items-center">
            {module.lessons.map((_, lessonIndex) => (
              <div 
                key={lessonIndex}
                className={`w-3 h-3 rounded-full ${
                  progress?.completedLessons.includes(module.lessons[lessonIndex].id)
                    ? 'bg-green-500 shadow-sm'
                    : isInProgress && lessonIndex === (progress?.currentLessonIndex || 0)
                      ? 'bg-blue-500 shadow-sm'
                      : 'bg-gray-300'
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-2 font-medium">
              {module.lessons.length} lessons
            </span>
          </div>
          
          <Link href={`/tutorial/${module.id}`}>
            <Button 
              size="sm" 
              className={
                isCompleted 
                  ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 font-medium shadow-sm" 
                  : "bg-blue-500 text-white hover:bg-blue-600 font-medium shadow-sm"
              }
            >
              {isCompleted ? "Review" : isInProgress ? "Continue" : "Start"}
            </Button>
          </Link>
        </div>
      </CardContent>
      
      {/* Expandable Content */}
      {isInProgress && (
        <div className="border-t border-blue-200 bg-blue-50/50">
          <Button
            variant="ghost"
            className="w-full p-4 text-left flex items-center justify-between hover:bg-blue-100 transition-colors text-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="text-sm font-medium">View Lessons</span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-blue-600" />
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
                        ? 'bg-green-100 border border-green-300'
                        : isCurrentLesson
                          ? 'bg-blue-100 border border-blue-300'
                          : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isLessonCompleted 
                        ? 'bg-green-500'
                        : isCurrentLesson
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-gray-400'
                    }`}>
                      {isLessonCompleted ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : isCurrentLesson ? (
                        <Play className="w-3 h-3 text-white" />
                      ) : (
                        <LessonIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-gray-800">{lesson.title}</h5>
                      <p className="text-xs text-gray-600">{lesson.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <LessonIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{lesson.type}</span>
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{lesson.estimatedTime}min</span>
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${
                      isLessonCompleted 
                        ? 'text-green-600'
                        : isCurrentLesson
                          ? 'text-blue-600'
                          : 'text-gray-500'
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
