import { UserProgress, TutorialModule } from "@shared/schema";

export interface LocalProgress {
  moduleId: string;
  completedLessons: string[];
  currentLessonIndex: number;
  completed: boolean;
  percentage: number;
  lastAccessed: string;
}

export interface OverallProgress {
  currentModule: number;
  totalModules: number;
  percentage: number;
  totalTime: number;
  completedTime: number;
}

export interface ActivityEntry {
  title: string;
  description: string;
  timestamp: string;
  type: "lesson_completed" | "module_completed" | "achievement_earned";
}

export class ProgressService {
  private static readonly STORAGE_KEY = "cyberLabsProgress";
  private static readonly ACTIVITY_KEY = "cyberLabsActivity";
  private static readonly BOOKMARKS_KEY = "cyberLabsBookmarks";

  // Progress Management
  static getModuleProgress(moduleId: string): LocalProgress | null {
    const allProgress = this.getAllProgress();
    return allProgress[moduleId] || null;
  }

  static getAllProgress(): Record<string, LocalProgress> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error loading progress:", error);
      return {};
    }
  }

  static updateLessonProgress(
    moduleId: string, 
    lessonId: string, 
    completed: boolean,
    totalLessons: number
  ): LocalProgress {
    const allProgress = this.getAllProgress();
    const moduleProgress = allProgress[moduleId] || {
      moduleId,
      completedLessons: [],
      currentLessonIndex: 0,
      completed: false,
      percentage: 0,
      lastAccessed: new Date().toISOString()
    };

    // Update completed lessons
    if (completed && !moduleProgress.completedLessons.includes(lessonId)) {
      moduleProgress.completedLessons.push(lessonId);
      
      // Add activity entry
      this.addActivity({
        title: "Lesson Completed",
        description: `Completed lesson in module ${moduleId}`,
        timestamp: new Date().toISOString(),
        type: "lesson_completed"
      });
    }

    // Calculate percentage and completion status
    moduleProgress.percentage = (moduleProgress.completedLessons.length / totalLessons) * 100;
    moduleProgress.completed = moduleProgress.completedLessons.length === totalLessons;
    moduleProgress.lastAccessed = new Date().toISOString();

    // Update current lesson index (next uncompleted lesson)
    moduleProgress.currentLessonIndex = moduleProgress.completedLessons.length;

    // Check for module completion
    if (moduleProgress.completed) {
      this.addActivity({
        title: "Module Completed",
        description: `Completed module ${moduleId}`,
        timestamp: new Date().toISOString(),
        type: "module_completed"
      });
    }

    // Save progress
    allProgress[moduleId] = moduleProgress;
    this.saveProgress(allProgress);

    return moduleProgress;
  }

  static getOverallProgress(modules: TutorialModule[] = []): OverallProgress {
    const allProgress = this.getAllProgress();
    const completedModules = Object.values(allProgress).filter(p => p.completed).length;
    const totalModules = modules.length || Object.keys(allProgress).length;
    
    const totalTime = modules.reduce((sum, m) => sum + m.estimatedTime, 0);
    const completedTime = modules
      .filter(m => allProgress[m.id]?.completed)
      .reduce((sum, m) => sum + m.estimatedTime, 0);

    return {
      currentModule: completedModules,
      totalModules,
      percentage: totalModules > 0 ? (completedModules / totalModules) * 100 : 0,
      totalTime,
      completedTime
    };
  }

  static resetProgress(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ACTIVITY_KEY);
  }

  static resetModuleProgress(moduleId: string): void {
    const allProgress = this.getAllProgress();
    delete allProgress[moduleId];
    this.saveProgress(allProgress);
  }

  private static saveProgress(progress: Record<string, LocalProgress>): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }

  // Activity Management
  static addActivity(activity: ActivityEntry): void {
    try {
      const activities = this.getRecentActivity();
      activities.unshift(activity);
      
      // Keep only last 50 activities
      const trimmedActivities = activities.slice(0, 50);
      localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(trimmedActivities));
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  }

  static getRecentActivity(): ActivityEntry[] {
    try {
      const stored = localStorage.getItem(this.ACTIVITY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading activity:", error);
      return [];
    }
  }

  // Bookmarks Management
  static addBookmark(moduleId: string, lessonId?: string, title?: string): void {
    try {
      const bookmarks = this.getBookmarks();
      const bookmark = {
        moduleId,
        lessonId,
        title: title || `Module ${moduleId}`,
        timestamp: new Date().toISOString()
      };
      
      // Avoid duplicates
      const exists = bookmarks.some(b => 
        b.moduleId === moduleId && b.lessonId === lessonId
      );
      
      if (!exists) {
        bookmarks.unshift(bookmark);
        localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
    }
  }

  static removeBookmark(moduleId: string, lessonId?: string): void {
    try {
      const bookmarks = this.getBookmarks();
      const filtered = bookmarks.filter(b => 
        !(b.moduleId === moduleId && b.lessonId === lessonId)
      );
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  }

  static getBookmarks(): Array<{
    moduleId: string;
    lessonId?: string;
    title: string;
    timestamp: string;
  }> {
    try {
      const stored = localStorage.getItem(this.BOOKMARKS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      return [];
    }
  }

  static isBookmarked(moduleId: string, lessonId?: string): boolean {
    const bookmarks = this.getBookmarks();
    return bookmarks.some(b => 
      b.moduleId === moduleId && b.lessonId === lessonId
    );
  }

  // Statistics and Analytics
  static getStudyStreak(): number {
    const activities = this.getRecentActivity();
    if (activities.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const activitiesByDate = new Map<string, boolean>();
    activities.forEach(activity => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);
      const dateKey = activityDate.toISOString().split('T')[0];
      activitiesByDate.set(dateKey, true);
    });

    // Count consecutive days backwards from today
    while (true) {
      const dateKey = currentDate.toISOString().split('T')[0];
      if (activitiesByDate.has(dateKey)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  static getTimeSpentLearning(): number {
    const allProgress = this.getAllProgress();
    // Estimate based on completed lessons and average time per lesson
    const completedLessons = Object.values(allProgress)
      .reduce((sum, p) => sum + p.completedLessons.length, 0);
    
    // Assume average 15 minutes per lesson
    return completedLessons * 15;
  }

  static getLearningStats() {
    const allProgress = this.getAllProgress();
    const activities = this.getRecentActivity();
    
    return {
      totalModulesStarted: Object.keys(allProgress).length,
      totalModulesCompleted: Object.values(allProgress).filter(p => p.completed).length,
      totalLessonsCompleted: Object.values(allProgress)
        .reduce((sum, p) => sum + p.completedLessons.length, 0),
      currentStreak: this.getStudyStreak(),
      timeSpent: this.getTimeSpentLearning(),
      totalActivities: activities.length,
      bookmarksCount: this.getBookmarks().length
    };
  }

  // Export/Import functionality
  static exportProgress(): string {
    const data = {
      progress: this.getAllProgress(),
      activity: this.getRecentActivity(),
      bookmarks: this.getBookmarks(),
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  static importProgress(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.progress) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.progress));
      }
      if (data.activity) {
        localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(data.activity));
      }
      if (data.bookmarks) {
        localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(data.bookmarks));
      }
      
      return true;
    } catch (error) {
      console.error("Error importing progress:", error);
      return false;
    }
  }
}
