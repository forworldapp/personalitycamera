import {
  users,
  personalityAnalysis,
  type User,
  type UpsertUser,
  type InsertPersonalityAnalysis,
  type PersonalityAnalysis,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Personality analysis operations
  createPersonalityAnalysis(analysis: InsertPersonalityAnalysis): Promise<PersonalityAnalysis>;
  getUserPersonalityAnalyses(userId: string, limit?: number): Promise<PersonalityAnalysis[]>;
  getPersonalityAnalysis(id: string): Promise<PersonalityAnalysis | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Personality analysis operations
  async createPersonalityAnalysis(analysis: InsertPersonalityAnalysis): Promise<PersonalityAnalysis> {
    const [created] = await db
      .insert(personalityAnalysis)
      .values(analysis)
      .returning();
    return created;
  }

  async getUserPersonalityAnalyses(userId: string, limit: number = 10): Promise<PersonalityAnalysis[]> {
    return await db
      .select()
      .from(personalityAnalysis)
      .where(eq(personalityAnalysis.userId, userId))
      .orderBy(desc(personalityAnalysis.createdAt))
      .limit(limit);
  }

  async getPersonalityAnalysis(id: string): Promise<PersonalityAnalysis | undefined> {
    const [analysis] = await db
      .select()
      .from(personalityAnalysis)
      .where(eq(personalityAnalysis.id, id));
    return analysis;
  }
}

export const storage = new DatabaseStorage();
