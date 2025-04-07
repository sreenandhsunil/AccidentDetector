import { 
  users, 
  cameras, 
  incidents, 
  notifications, 
  systemStats,
  type User, 
  type InsertUser, 
  type Camera, 
  type InsertCamera,
  type Incident,
  type InsertIncident,
  type Notification,
  type InsertNotification,
  type SystemStat,
  type InsertSystemStat
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Camera methods
  getCamera(id: number): Promise<Camera | undefined>;
  createCamera(camera: InsertCamera): Promise<Camera>;
  getAllCameras(): Promise<Camera[]>;
  updateCameraStatus(id: number, status: string): Promise<Camera | undefined>;
  
  // Incident methods
  getIncident(id: number): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  getAllIncidents(): Promise<Incident[]>;
  getIncidentsByCameraId(cameraId: number): Promise<Incident[]>;
  reviewIncident(id: number): Promise<Incident | undefined>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  
  // System stats methods
  getLatestSystemStats(): Promise<SystemStat | undefined>;
  createSystemStat(stat: InsertSystemStat): Promise<SystemStat>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with admin user if it doesn't exist
    this.initializeAdmin().catch(err => console.error("Failed to initialize admin:", err));
  }

  private async initializeAdmin() {
    const adminExists = await this.getUserByUsername("admin");
    if (!adminExists) {
      await this.createUser({
        username: "admin",
        password: "password", // In a real app, this would be hashed
        fullName: "Admin User",
        email: "admin@example.com",
        role: "admin"
      });
      console.log("Admin user created");
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Camera methods
  async getCamera(id: number): Promise<Camera | undefined> {
    const [camera] = await db.select().from(cameras).where(eq(cameras.id, id));
    return camera;
  }

  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const [camera] = await db
      .insert(cameras)
      .values(insertCamera)
      .returning();
    return camera;
  }

  async getAllCameras(): Promise<Camera[]> {
    return await db.select().from(cameras);
  }

  async updateCameraStatus(id: number, status: string): Promise<Camera | undefined> {
    const [camera] = await db
      .update(cameras)
      .set({ status })
      .where(eq(cameras.id, id))
      .returning();
    return camera;
  }

  // Incident methods
  async getIncident(id: number): Promise<Incident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident;
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const [incident] = await db
      .insert(incidents)
      .values(insertIncident)
      .returning();
    return incident;
  }

  async getAllIncidents(): Promise<Incident[]> {
    return await db.select().from(incidents).orderBy(desc(incidents.timestamp));
  }

  async getIncidentsByCameraId(cameraId: number): Promise<Incident[]> {
    return await db
      .select()
      .from(incidents)
      .where(eq(incidents.cameraId, cameraId))
      .orderBy(desc(incidents.timestamp));
  }

  async reviewIncident(id: number): Promise<Incident | undefined> {
    const [incident] = await db
      .update(incidents)
      .set({ reviewed: true })
      .where(eq(incidents.id, id))
      .returning();
    return incident;
  }

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  // System stats methods
  async getLatestSystemStats(): Promise<SystemStat | undefined> {
    const [stat] = await db
      .select()
      .from(systemStats)
      .orderBy(desc(systemStats.timestamp))
      .limit(1);
    return stat;
  }

  async createSystemStat(insertStat: InsertSystemStat): Promise<SystemStat> {
    const [stat] = await db
      .insert(systemStats)
      .values(insertStat)
      .returning();
    return stat;
  }
}

export const storage = new DatabaseStorage();
