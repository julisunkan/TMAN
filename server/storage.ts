import { type User, type InsertUser, type UserProgress, type InsertProgress, type Bookmark, type InsertBookmark, type Achievement, type InsertAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getModuleProgress(userId: string, moduleId: string): Promise<UserProgress | undefined>;
  updateProgress(progress: InsertProgress): Promise<UserProgress>;
  
  // Bookmark methods
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  addBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  removeBookmark(userId: string, moduleId: string, lessonId?: string): Promise<boolean>;
  
  // Achievement methods
  getUserAchievements(userId: string): Promise<Achievement[]>;
  addAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private progress: Map<string, UserProgress>;
  private bookmarks: Map<string, Bookmark>;
  private achievements: Map<string, Achievement>;

  constructor() {
    this.users = new Map();
    this.progress = new Map();
    this.bookmarks = new Map();
    this.achievements = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.progress.values()).filter(p => p.userId === userId);
  }

  async getModuleProgress(userId: string, moduleId: string): Promise<UserProgress | undefined> {
    return Array.from(this.progress.values()).find(
      p => p.userId === userId && p.moduleId === moduleId
    );
  }

  async updateProgress(insertProgress: InsertProgress): Promise<UserProgress> {
    const existing = Array.from(this.progress.values()).find(
      p => p.userId === insertProgress.userId && 
           p.moduleId === insertProgress.moduleId &&
           p.lessonId === insertProgress.lessonId
    );

    if (existing) {
      const updated: UserProgress = {
        ...existing,
        ...insertProgress,
        lastAccessed: new Date()
      };
      this.progress.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const progress: UserProgress = {
        ...insertProgress,
        id,
        lessonId: insertProgress.lessonId ?? null,
        completed: insertProgress.completed ?? false,
        progress: insertProgress.progress ?? 0,
        lastAccessed: new Date()
      };
      this.progress.set(id, progress);
      return progress;
    }
  }

  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(b => b.userId === userId);
  }

  async addBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = {
      ...insertBookmark,
      id,
      lessonId: insertBookmark.lessonId ?? null,
      sectionId: insertBookmark.sectionId ?? null,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async removeBookmark(userId: string, moduleId: string, lessonId?: string): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values()).find(
      b => b.userId === userId && b.moduleId === moduleId && b.lessonId === lessonId
    );
    
    if (bookmark) {
      this.bookmarks.delete(bookmark.id);
      return true;
    }
    return false;
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(a => a.userId === userId);
  }

  async addAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      metadata: insertAchievement.metadata ?? null,
      earnedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
