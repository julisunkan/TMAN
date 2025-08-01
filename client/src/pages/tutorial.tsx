import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import MobileHeader from "@/components/layout/mobile-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import TutorialContent from "@/components/tutorial/tutorial-content"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen,
  CheckCircle,
  Circle,
  Home
} from "lucide-react";
import { TutorialModule } from "@shared/schema";
import { useProgress } from "@/hooks/use-progress";
import { Link } from "wouter";

export default function Tutorial() {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId?: string }>();
  
  const { data: module, isLoading } = useQuery<TutorialModule>({
    queryKey: ["/api/tutorials", moduleId],
  });

  // Get all modules for navigation
  const { data: allModulesData } = useQuery<{ modules: TutorialModule[] }>({
    queryKey: ["/api/tutorials"],
  });

  const { getModuleProgress, updateLessonProgress } = useProgress();
  const progress = getModuleProgress(moduleId!);

  // Scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonId, moduleId]);

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

  if (!module) {
    return (
      <div className="min-h-screen">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-600">Module not found</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const currentLesson = lessonId ? module.lessons.find(l => l.id === lessonId) : module.lessons[0];
  const currentLessonIndex = currentLesson ? module.lessons.findIndex(l => l.id === currentLesson.id) : 0;
  const nextLesson = module.lessons[currentLessonIndex + 1];
  const prevLesson = module.lessons[currentLessonIndex - 1];

  const completedLessons = progress?.completedLessons || [];
  const moduleProgress = (completedLessons.length / module.lessons.length) * 100;

  // Module navigation
  const allModules = allModulesData?.modules || [];
  const currentModuleIndex = allModules.findIndex(m => m.id === moduleId);
  const nextModule = allModules[currentModuleIndex + 1];
  const prevModule = allModules[currentModuleIndex - 1];

  const handleCompleteLesson = () => {
    if (currentLesson) {
      updateLessonProgress(moduleId!, currentLesson.id, true);
    }
  };

  if (!currentLesson) {
    // Show module overview
    return (
      <div className="min-h-screen pb-20">
        <MobileHeader />
        
        {/* Module Header */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8 mx-4 mt-4 rounded-3xl shadow-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-100 font-medium">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
            <Link href="/modules">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-100 font-medium">
                All Modules
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
              <p className="text-sm text-gray-600 font-medium">Module • {module.estimatedTime} min</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 text-lg">{module.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {module.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-white/80 text-gray-700 border border-gray-300">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-bold text-gray-800">{Math.round(moduleProgress)}%</span>
            </div>
            <Progress value={moduleProgress} className="h-3" />
          </div>
          
          {/* Module Navigation */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            {prevModule ? (
              <Link href={`/tutorial/${prevModule.id}`}>
                <Button variant="outline" size="sm" className="text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50">
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  {prevModule.title}
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
            
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
              Module {currentModuleIndex + 1} of {allModules.length}
            </Badge>
            
            {nextModule ? (
              <Link href={`/tutorial/${nextModule.id}`}>
                <Button variant="outline" size="sm" className="text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50">
                  {nextModule.title}
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className="px-4 py-6 space-y-4">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Lessons</h2>
          {module.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = false; // All lessons are unlocked
            
            return (
              <Card key={lesson.id} className="bg-white border shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                      isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{lesson.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.estimatedTime} min</span>
                        </div>
                        <Badge variant="outline" className="border-gray-300 text-gray-600">
                          {lesson.type}
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/tutorial/${moduleId}/${lesson.id}`}>
                      <Button size="sm" className={isCompleted ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200" : "bg-blue-500 text-white hover:bg-blue-600 shadow-sm"}>
                        {isCompleted ? "Review" : "Start"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <MobileHeader />
      
      {/* Lesson Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-6 mx-4 mt-4 rounded-2xl shadow-lg border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <Link href={`/tutorial/${moduleId}`}>
            <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-100 font-medium">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {module.title}
            </Button>
          </Link>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border border-blue-300">
            {currentLessonIndex + 1} of {module.lessons.length}
          </Badge>
        </div>
        
        <h1 className="text-xl font-bold mb-2 text-gray-800">{currentLesson.title}</h1>
        <p className="text-sm text-gray-600">{currentLesson.description}</p>
        
        <div className="flex items-center space-x-4 mt-3 text-xs">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span>{currentLesson.estimatedTime} min</span>
          </div>
          <Badge variant="outline" className="border-gray-300 text-gray-600">
            {currentLesson.type}
          </Badge>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1">
        <TutorialContent lesson={currentLesson} />
      </div>

      {/* Navigation */}
      <div className="sticky bottom-16 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-4 mx-4 rounded-t-2xl shadow-lg">
        <div className="flex justify-between items-center">
          {prevLesson ? (
            <Link href={`/tutorial/${moduleId}/${prevLesson.id}`}>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50 font-medium">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : prevModule ? (
            <Link href={`/tutorial/${prevModule.id}`}>
              <Button variant="outline" size="sm" className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50 font-medium">
                <ChevronLeft className="w-3 h-3 mr-1" />
                {prevModule.title}
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
          
          <Button 
            onClick={handleCompleteLesson}
            className={`${
              completedLessons.includes(currentLesson.id) 
                ? "bg-green-500 text-white hover:bg-green-600" 
                : "bg-green-500 text-white hover:bg-green-600"
            } font-medium shadow-sm`}
            size="sm"
          >
            {completedLessons.includes(currentLesson.id) ? "Completed ✓" : "Mark Complete"}
          </Button>
          
          {nextLesson ? (
            <Link href={`/tutorial/${moduleId}/${nextLesson.id}`}>
              <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600 font-medium shadow-sm">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : nextModule ? (
            <Link href={`/tutorial/${nextModule.id}`}>
              <Button size="sm" className="text-xs bg-blue-500 text-white hover:bg-blue-600 font-medium shadow-sm">
                {nextModule.title}
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
