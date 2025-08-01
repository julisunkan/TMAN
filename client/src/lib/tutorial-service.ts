import { TutorialModule, TutorialLesson, SearchResult } from "@shared/schema";

export class TutorialService {
  private static baseUrl = "/api";

  static async getAllTutorials(): Promise<{ modules: TutorialModule[] }> {
    const response = await fetch(`${this.baseUrl}/tutorials`);
    if (!response.ok) {
      throw new Error("Failed to fetch tutorials");
    }
    return response.json();
  }

  static async getTutorialModule(moduleId: string): Promise<TutorialModule> {
    const response = await fetch(`${this.baseUrl}/tutorials/${moduleId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch module: ${moduleId}`);
    }
    return response.json();
  }

  static async searchTutorials(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query.trim())}`);
    if (!response.ok) {
      throw new Error("Failed to search tutorials");
    }
    return response.json();
  }

  static async getModuleLesson(moduleId: string, lessonId: string): Promise<TutorialLesson> {
    const module = await this.getTutorialModule(moduleId);
    const lesson = module.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error(`Lesson not found: ${lessonId} in module ${moduleId}`);
    }
    return lesson;
  }

  static getEstimatedReadTime(content: string): number {
    // Average reading speed: 200 words per minute
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200);
  }

  static getModuleDifficulty(module: TutorialModule): "Beginner" | "Intermediate" | "Advanced" {
    switch (module.category) {
      case "intro":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return "Intermediate";
    }
  }

  static getPrerequisiteModules(moduleId: string, allModules: TutorialModule[]): TutorialModule[] {
    const module = allModules.find(m => m.id === moduleId);
    if (!module?.prerequisites) {
      return [];
    }

    return allModules.filter(m => module.prerequisites!.includes(m.id));
  }

  static getNextModule(currentModuleId: string, allModules: TutorialModule[]): TutorialModule | null {
    const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
    if (currentIndex === -1 || currentIndex === allModules.length - 1) {
      return null;
    }
    return allModules[currentIndex + 1];
  }

  static getPreviousModule(currentModuleId: string, allModules: TutorialModule[]): TutorialModule | null {
    const currentIndex = allModules.findIndex(m => m.id === currentModuleId);
    if (currentIndex <= 0) {
      return null;
    }
    return allModules[currentIndex - 1];
  }

  static filterModulesByCategory(modules: TutorialModule[], category: string): TutorialModule[] {
    if (category === "all") {
      return modules;
    }
    return modules.filter(m => m.category === category);
  }

  static filterModulesByTags(modules: TutorialModule[], tags: string[]): TutorialModule[] {
    if (tags.length === 0) {
      return modules;
    }
    return modules.filter(m => 
      tags.some(tag => m.tags.some(moduleTag => 
        moduleTag.toLowerCase().includes(tag.toLowerCase())
      ))
    );
  }

  static sortModulesByDifficulty(modules: TutorialModule[]): TutorialModule[] {
    const order = { "intro": 1, "intermediate": 2, "advanced": 3, "tools": 4 };
    return [...modules].sort((a, b) => (order[a.category] || 5) - (order[b.category] || 5));
  }

  static getModuleStats(modules: TutorialModule[]) {
    return {
      total: modules.length,
      totalTime: modules.reduce((sum, m) => sum + m.estimatedTime, 0),
      totalLessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
      byCategory: {
        intro: modules.filter(m => m.category === "intro").length,
        intermediate: modules.filter(m => m.category === "intermediate").length,
        advanced: modules.filter(m => m.category === "advanced").length,
        tools: modules.filter(m => m.category === "tools").length,
      }
    };
  }
}
