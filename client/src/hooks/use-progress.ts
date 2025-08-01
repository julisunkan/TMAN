import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgressService, LocalProgress, OverallProgress, ActivityEntry } from "@/lib/progress-service";
import { TutorialModule } from "@shared/schema";

export function useProgress() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get all tutorials to calculate overall progress
  const { data: tutorials } = useQuery<{modules: TutorialModule[]}>({
    queryKey: ["/api/tutorials"],
  });

  const modules = tutorials?.modules || [];

  const getModuleProgress = useCallback((moduleId: string): LocalProgress | null => {
    // Trigger re-render when progress changes
    refreshTrigger; // eslint-disable-line
    return ProgressService.getModuleProgress(moduleId);
  }, [refreshTrigger]);

  const getAllProgress = useCallback(() => {
    refreshTrigger; // eslint-disable-line
    return ProgressService.getAllProgress();
  }, [refreshTrigger]);

  const getOverallProgress = useCallback((): OverallProgress => {
    refreshTrigger; // eslint-disable-line
    return ProgressService.getOverallProgress(modules);
  }, [modules, refreshTrigger]);

  const updateLessonProgress = useCallback((
    moduleId: string, 
    lessonId: string, 
    completed: boolean
  ): LocalProgress => {
    const module = modules.find(m => m.id === moduleId);
    const totalLessons = module?.lessons.length || 1;
    
    const result = ProgressService.updateLessonProgress(moduleId, lessonId, completed, totalLessons);
    setRefreshTrigger(prev => prev + 1); // Force re-render
    return result;
  }, [modules]);

  const resetProgress = useCallback(() => {
    ProgressService.resetProgress();
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const resetModuleProgress = useCallback((moduleId: string) => {
    ProgressService.resetModuleProgress(moduleId);
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Activity methods
  const getRecentActivity = useCallback((): ActivityEntry[] => {
    return ProgressService.getRecentActivity();
  }, []);

  const addActivity = useCallback((activity: ActivityEntry) => {
    ProgressService.addActivity(activity);
  }, []);

  // Bookmark methods
  const addBookmark = useCallback((moduleId: string, lessonId?: string, title?: string) => {
    ProgressService.addBookmark(moduleId, lessonId, title);
  }, []);

  const removeBookmark = useCallback((moduleId: string, lessonId?: string) => {
    ProgressService.removeBookmark(moduleId, lessonId);
  }, []);

  const getBookmarks = useCallback(() => {
    return ProgressService.getBookmarks();
  }, []);

  const isBookmarked = useCallback((moduleId: string, lessonId?: string): boolean => {
    return ProgressService.isBookmarked(moduleId, lessonId);
  }, []);

  // Statistics
  const getStudyStreak = useCallback((): number => {
    return ProgressService.getStudyStreak();
  }, []);

  const getLearningStats = useCallback(() => {
    refreshTrigger; // eslint-disable-line
    return ProgressService.getLearningStats();
  }, [refreshTrigger]);

  const getTimeSpentLearning = useCallback((): number => {
    return ProgressService.getTimeSpentLearning();
  }, []);

  // Export/Import
  const exportProgress = useCallback((): string => {
    return ProgressService.exportProgress();
  }, []);

  const importProgress = useCallback((jsonData: string): boolean => {
    const result = ProgressService.importProgress(jsonData);
    if (result) {
      setRefreshTrigger(prev => prev + 1);
    }
    return result;
  }, []);

  // Helper methods
  const getCompletedModulesCount = useCallback((): number => {
    const allProgress = getAllProgress();
    return Object.values(allProgress).filter(p => p.completed).length;
  }, [getAllProgress]);

  const getTotalLessonsCompleted = useCallback((): number => {
    const allProgress = getAllProgress();
    return Object.values(allProgress).reduce((sum, p) => sum + p.completedLessons.length, 0);
  }, [getAllProgress]);

  const getNextModule = useCallback((currentModuleId: string): TutorialModule | null => {
    const currentIndex = modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex === -1 || currentIndex === modules.length - 1) {
      return null;
    }
    return modules[currentIndex + 1];
  }, [modules]);

  const getPreviousModule = useCallback((currentModuleId: string): TutorialModule | null => {
    const currentIndex = modules.findIndex(m => m.id === currentModuleId);
    if (currentIndex <= 0) {
      return null;
    }
    return modules[currentIndex - 1];
  }, [modules]);

  const isModuleUnlocked = useCallback((moduleId: string): boolean => {
    const module = modules.find(m => m.id === moduleId);
    if (!module?.prerequisites || module.prerequisites.length === 0) {
      return true;
    }
    
    const allProgress = getAllProgress();
    return module.prerequisites.every(prereqId => 
      allProgress[prereqId]?.completed || false
    );
  }, [modules, getAllProgress]);

  return {
    // Progress queries
    getModuleProgress,
    getAllProgress,
    getOverallProgress,
    
    // Progress mutations
    updateLessonProgress,
    resetProgress,
    resetModuleProgress,
    
    // Activity
    getRecentActivity,
    addActivity,
    
    // Bookmarks
    addBookmark,
    removeBookmark,
    getBookmarks,
    isBookmarked,
    
    // Statistics
    getStudyStreak,
    getLearningStats,
    getTimeSpentLearning,
    getCompletedModulesCount,
    getTotalLessonsCompleted,
    
    // Navigation helpers
    getNextModule,
    getPreviousModule,
    isModuleUnlocked,
    
    // Export/Import
    exportProgress,
    importProgress,
  };
}
