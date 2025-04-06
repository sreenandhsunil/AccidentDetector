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

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cameras: Map<number, Camera>;
  private incidents: Map<number, Incident>;
  private notifications: Map<number, Notification>;
  private systemStats: Map<number, SystemStat>;
  private userIdCounter: number;
  private cameraIdCounter: number;
  private incidentIdCounter: number;
  private notificationIdCounter: number;
  private systemStatIdCounter: number;

  constructor() {
    this.users = new Map();
    this.cameras = new Map();
    this.incidents = new Map();
    this.notifications = new Map();
    this.systemStats = new Map();
    this.userIdCounter = 1;
    this.cameraIdCounter = 1;
    this.incidentIdCounter = 1;
    this.notificationIdCounter = 1;
    this.systemStatIdCounter = 1;
    
    // Initialize with admin user
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      fullName: "Admin User",
      email: "admin@example.com",
      role: "admin"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      lastLogin: null,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Camera methods
  async getCamera(id: number): Promise<Camera | undefined> {
    return this.cameras.get(id);
  }

  async createCamera(insertCamera: InsertCamera): Promise<Camera> {
    const id = this.cameraIdCounter++;
    const now = new Date();
    const camera: Camera = { 
      ...insertCamera, 
      id, 
      createdAt: now 
    };
    this.cameras.set(id, camera);
    return camera;
  }

  async getAllCameras(): Promise<Camera[]> {
    return Array.from(this.cameras.values());
  }

  async updateCameraStatus(id: number, status: string): Promise<Camera | undefined> {
    const camera = this.cameras.get(id);
    if (!camera) return undefined;
    
    const updatedCamera: Camera = {
      ...camera,
      status
    };
    this.cameras.set(id, updatedCamera);
    return updatedCamera;
  }

  // Incident methods
  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.incidentIdCounter++;
    const now = new Date();
    const incident: Incident = { 
      ...insertIncident, 
      id, 
      reviewed: false,
      createdAt: now 
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async getAllIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getIncidentsByCameraId(cameraId: number): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(
      (incident) => incident.cameraId === cameraId
    );
  }

  async reviewIncident(id: number): Promise<Incident | undefined> {
    const incident = this.incidents.get(id);
    if (!incident) return undefined;
    
    const updatedIncident: Incident = {
      ...incident,
      reviewed: true
    };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      sent: false,
      sentAt: null,
      createdAt: now 
    };
    this.notifications.set(id, notification);
    return notification;
  }

  // System stats methods
  async getLatestSystemStats(): Promise<SystemStat | undefined> {
    const stats = Array.from(this.systemStats.values());
    if (stats.length === 0) return undefined;
    
    return stats.sort((a, b) => {
      return b.timestamp.getTime() - a.timestamp.getTime();
    })[0];
  }

  async createSystemStat(insertStat: InsertSystemStat): Promise<SystemStat> {
    const id = this.systemStatIdCounter++;
    const stat: SystemStat = { 
      ...insertStat, 
      id 
    };
    this.systemStats.set(id, stat);
    return stat;
  }
}

export const storage = new MemStorage();
