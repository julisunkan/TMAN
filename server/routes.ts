import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgressSchema, insertBookmarkSchema, insertAchievementSchema } from "@shared/schema";
import tutorialsData from "./data/tutorials.json";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tutorials
  app.get("/api/tutorials", (req, res) => {
    res.json(tutorialsData);
  });

  // Get specific tutorial module
  app.get("/api/tutorials/:moduleId", (req, res) => {
    const module = tutorialsData.modules.find(m => m.id === req.params.moduleId);
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }
    res.json(module);
  });

  // Search tutorials
  app.get("/api/search", (req, res) => {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const results: any[] = [];
    const searchQuery = query.toLowerCase();

    tutorialsData.modules.forEach(module => {
      // Search module title and description
      if (module.title.toLowerCase().includes(searchQuery) || 
          module.description.toLowerCase().includes(searchQuery)) {
        results.push({
          moduleId: module.id,
          title: module.title,
          description: module.description,
          type: 'module'
        });
      }

      // Search lessons
      module.lessons.forEach(lesson => {
        if (lesson.title.toLowerCase().includes(searchQuery) ||
            lesson.description.toLowerCase().includes(searchQuery)) {
          results.push({
            moduleId: module.id,
            lessonId: lesson.id,
            title: lesson.title,
            description: lesson.description,
            type: 'lesson'
          });
        }

        // Search lesson content
        lesson.content.forEach(section => {
          if (section.content.toLowerCase().includes(searchQuery)) {
            results.push({
              moduleId: module.id,
              lessonId: lesson.id,
              sectionId: section.id,
              title: section.title || lesson.title,
              description: section.content.substring(0, 100) + '...',
              content: section.content,
              type: 'section'
            });
          }
        });
      });
    });

    res.json(results.slice(0, 20)); // Limit results
  });

  // Progress endpoints
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.updateProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // Bookmark endpoints
  app.get("/api/bookmarks/:userId", async (req, res) => {
    try {
      const bookmarks = await storage.getUserBookmarks(req.params.userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const bookmarkData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.addBookmark(bookmarkData);
      res.json(bookmark);
    } catch (error) {
      res.status(400).json({ message: "Invalid bookmark data" });
    }
  });

  app.delete("/api/bookmarks/:userId/:moduleId/:lessonId?", async (req, res) => {
    try {
      const { userId, moduleId, lessonId } = req.params;
      const removed = await storage.removeBookmark(userId, moduleId, lessonId);
      res.json({ success: removed });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove bookmark" });
    }
  });

  // Achievement endpoints
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(req.params.userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.post("/api/achievements", async (req, res) => {
    try {
      const achievementData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.addAchievement(achievementData);
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ message: "Invalid achievement data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
