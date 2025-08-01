import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: text("module_id").notNull(),
  lessonId: text("lesson_id"),
  completed: boolean("completed").default(false).notNull(),
  progress: integer("progress").default(0).notNull(),
  lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  moduleId: text("module_id").notNull(),
  lessonId: text("lesson_id"),
  sectionId: text("section_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'module_complete', 'streak', 'milestone'
  title: text("title").notNull(),
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

// Tutorial types
export interface TutorialModule {
  id: string;
  title: string;
  description: string;
  category: 'intro' | 'intermediate' | 'advanced' | 'tools';
  estimatedTime: number;
  lessons: TutorialLesson[];
  prerequisites?: string[];
  tags: string[];
  icon: string;
}

export interface TutorialLesson {
  id: string;
  title: string;
  description: string;
  content: TutorialSection[];
  estimatedTime: number;
  type: 'theory' | 'hands-on' | 'lab';
}

export interface TutorialSection {
  id: string;
  type: 'text' | 'code' | 'command' | 'image' | 'warning' | 'info' | 'checklist';
  title?: string;
  content: string;
  language?: string; // for code blocks
  copyable?: boolean;
}

export interface SearchResult {
  moduleId: string;
  lessonId?: string;
  sectionId?: string;
  title: string;
  description: string;
  content: string;
  type: 'module' | 'lesson' | 'section';
}
