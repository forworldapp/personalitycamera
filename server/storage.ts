import {
  users,
  agePredictions,
  type User,
  type UpsertUser,
  type InsertAgePrediction,
  type AgePrediction,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Age prediction operations
  createAgePrediction(prediction: InsertAgePrediction): Promise<AgePrediction>;
  getUserAgePredictions(userId: string, limit?: number): Promise<AgePrediction[]>;
  getAgePrediction(id: string): Promise<AgePrediction | undefined>;
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

  // Age prediction operations
  async createAgePrediction(prediction: InsertAgePrediction): Promise<AgePrediction> {
    const [created] = await db
      .insert(agePredictions)
      .values(prediction)
      .returning();
    return created;
  }

  async getUserAgePredictions(userId: string, limit: number = 10): Promise<AgePrediction[]> {
    return await db
      .select()
      .from(agePredictions)
      .where(eq(agePredictions.userId, userId))
      .orderBy(desc(agePredictions.createdAt))
      .limit(limit);
  }

  async getAgePrediction(id: string): Promise<AgePrediction | undefined> {
    const [prediction] = await db
      .select()
      .from(agePredictions)
      .where(eq(agePredictions.id, id));
    return prediction;
  }
}

export const storage = new DatabaseStorage();
