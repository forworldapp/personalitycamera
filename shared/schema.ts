import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  serial,
  uuid
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Personality analysis table
export const personalityAnalysis = pgTable("personality_analysis", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url").notNull(),
  mbtiType: varchar("mbti_type").notNull(),
  confidence: varchar("confidence"),
  traits: jsonb("traits").notNull(), // {openness: 8, conscientiousness: 7, extraversion: 6, agreeableness: 9, neuroticism: 3}
  analysis: jsonb("analysis").notNull(), // {ko: "한국어 분석", en: "English analysis"}
  strengths: jsonb("strengths").notNull(), // {ko: "한국어 강점", en: "English strengths"}
  weaknesses: jsonb("weaknesses").notNull(), // {ko: "한국어 약점", en: "English weaknesses"}
  recommendations: jsonb("recommendations").notNull(), // {ko: "한국어 추천", en: "English recommendations"}
  geminiResponse: jsonb("gemini_response"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPersonalityAnalysisSchema = createInsertSchema(personalityAnalysis).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertPersonalityAnalysis = z.infer<typeof insertPersonalityAnalysisSchema>;
export type PersonalityAnalysis = typeof personalityAnalysis.$inferSelect;
