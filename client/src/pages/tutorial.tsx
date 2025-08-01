import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
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

  if (!module) {
    return (
      <div className="min-h-screen bg-[hsl(240,10%,6%)]">
        <MobileHeader />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-[hsl(215,16%,47%)]">Module not found</p>
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
      <div className="min-h-screen bg-[hsl(240,10%,6%)] pb-20">
        <MobileHeader />
        
        {/* Module Header */}
        <div className="bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)] px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-[hsl(120,100%,50%)] hover:bg-[hsl(120,100%,50%)]/10">
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
            <Link href="/modules">
              <Button variant="ghost" size="sm" className="text-[hsl(207,90%,54%)] hover:bg-[hsl(207,90%,54%)]/10">
                All Modules
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[hsl(207,90%,54%)] rounded-lg flex items-center justify-center">
              <i className={`${module.icon} text-[hsl(240,10%,6%)]`}></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">{module.title}</h1>
              <p className="text-sm text-[hsl(215,16%,47%)]">Module • {module.estimatedTime} min</p>
            </div>
          </div>
          
          <p className="text-[hsl(215,16%,47%)] mb-4">{module.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {module.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-[hsl(240,10%,6%)]/50">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[hsl(215,16%,47%)]">Progress</span>
              <span className="text-sm font-medium">{Math.round(moduleProgress)}%</span>
            </div>
            <Progress value={moduleProgress} className="h-2" />
          </div>
          
          {/* Module Navigation */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-[hsl(240,3.7%,15.9%)]">
            {prevModule ? (
              <Link href={`/tutorial/${prevModule.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
                  <ChevronLeft className="w-3 h-3 mr-1" />
                  {prevModule.title}
                </Button>
              </Link>
            ) : (
              <div></div>
            )}
            
            <Badge variant="secondary" className="bg-[hsl(240,10%,6%)]/50 text-xs">
              Module {currentModuleIndex + 1} of {allModules.length}
            </Badge>
            
            {nextModule ? (
              <Link href={`/tutorial/${nextModule.id}`}>
                <Button variant="outline" size="sm" className="text-xs">
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
        <div className="px-4 py-6 space-y-3">
          <h2 className="text-lg font-semibold mb-4">Lessons</h2>
          {module.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isLocked = index > 0 && !completedLessons.includes(module.lessons[index - 1].id);
            
            return (
              <Card key={lesson.id} className={`bg-[hsl(240,6%,10%)] border-[hsl(240,3.7%,15.9%)] ${isLocked ? 'opacity-60' : 'hover:border-[hsl(207,90%,54%)]/30'} transition-colors`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-[hsl(120,100%,50%)]' : 
                      isLocked ? 'bg-gray-600' : 'bg-[hsl(207,90%,54%)]'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-[hsl(240,10%,6%)]" />
                      ) : isLocked ? (
                        <Circle className="w-4 h-4 text-gray-400" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-[hsl(215,16%,47%)] mb-2">{lesson.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-[hsl(215,16%,47%)]">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{lesson.estimatedTime} min</span>
                        </div>
                        <Badge variant="outline" size="sm">
                          {lesson.type}
                        </Badge>
                      </div>
                    </div>
                    {!isLocked && (
                      <Link href={`/tutorial/${moduleId}/${lesson.id}`}>
                        <Button size="sm" variant={isCompleted ? "secondary" : "default"}>
                          {isCompleted ? "Review" : "Start"}
                        </Button>
                      </Link>
                    )}
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
    <div className="min-h-screen bg-[hsl(240,10%,6%)] pb-20">
      <MobileHeader />
      
      {/* Lesson Header */}
      <div className="bg-[hsl(227,39%,23%)] px-4 py-4 border-b border-[hsl(120,100%,50%)]/20">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/tutorial/${moduleId}`}>
            <Button variant="ghost" size="sm" className="text-[hsl(120,100%,50%)] hover:bg-[hsl(120,100%,50%)]/10">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {module.title}
            </Button>
          </Link>
          <Badge variant="secondary" className="bg-[hsl(207,90%,54%)]/20 text-[hsl(207,90%,54%)]">
            {currentLessonIndex + 1} of {module.lessons.length}
          </Badge>
        </div>
        
        <h1 className="text-lg font-semibold mb-1">{currentLesson.title}</h1>
        <p className="text-sm text-[hsl(215,16%,47%)]">{currentLesson.description}</p>
        
        <div className="flex items-center space-x-4 mt-3 text-xs text-[hsl(215,16%,47%)]">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{currentLesson.estimatedTime} min</span>
          </div>
          <Badge variant="outline" size="sm">
            {currentLesson.type}
          </Badge>
        </div>
      </div>

      {/* Lesson Content */}
      <div className="flex-1">
        <TutorialContent lesson={currentLesson} />
      </div>

      {/* Navigation */}
      <div className="sticky bottom-16 bg-[hsl(227,39%,23%)]/95 backdrop-blur-lg border-t border-[hsl(120,100%,50%)]/20 px-4 py-3">
        <div className="flex justify-between items-center">
          {prevLesson ? (
            <Link href={`/tutorial/${moduleId}/${prevLesson.id}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
            </Link>
          ) : prevModule ? (
            <Link href={`/tutorial/${prevModule.id}`}>
              <Button variant="outline" size="sm" className="text-xs">
                <ChevronLeft className="w-3 h-3 mr-1" />
                {prevModule.title}
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
          
          <Button 
            onClick={handleCompleteLesson}
            className="bg-[hsl(120,100%,50%)] text-[hsl(240,10%,6%)] hover:bg-[hsl(105,100%,55%)]"
            size="sm"
          >
            {completedLessons.includes(currentLesson.id) ? "Completed" : "Mark Complete"}
          </Button>
          
          {nextLesson ? (
            <Link href={`/tutorial/${moduleId}/${nextLesson.id}`}>
              <Button size="sm">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : nextModule ? (
            <Link href={`/tutorial/${nextModule.id}`}>
              <Button size="sm" className="text-xs">
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
