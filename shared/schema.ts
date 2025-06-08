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

// Age predictions table
export const agePredictions = pgTable("age_predictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").notNull().references(() => users.id),
  imageUrl: varchar("image_url").notNull(),
  predictedAge: integer("predicted_age").notNull(),
  futureAge: integer("future_age"),
  confidence: varchar("confidence"),
  geminiResponse: jsonb("gemini_response"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertAgePredictionSchema = createInsertSchema(agePredictions).omit({
  id: true,
  createdAt: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertAgePrediction = z.infer<typeof insertAgePredictionSchema>;
export type AgePrediction = typeof agePredictions.$inferSelect;
