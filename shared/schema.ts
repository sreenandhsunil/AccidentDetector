import { sqliteTable, text, integer, primaryKey, blob } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  lastLogin: text("last_login"), // SQLite doesn't support native timestamp type
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Cameras table
export const cameras = sqliteTable("cameras", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  streamUrl: text("stream_url"),
  status: text("status").notNull().default("offline"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Incidents table
export const incidents = sqliteTable("incidents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cameraId: integer("camera_id").notNull().references(() => cameras.id),
  timestamp: text("timestamp").default("CURRENT_TIMESTAMP").notNull(),
  type: text("type").notNull(),
  severity: text("severity").notNull(),
  location: text("location").notNull(),
  detections: text("detections"), // Store JSON as text in SQLite
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  reviewed: integer("reviewed", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  incidentId: integer("incident_id").notNull().references(() => incidents.id),
  recipient: text("recipient").notNull(),
  type: text("type").notNull(),
  sent: integer("sent", { mode: "boolean" }).default(false).notNull(),
  sentAt: text("sent_at"),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP").notNull(),
});

// System stats table
export const systemStats = sqliteTable("system_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timestamp: text("timestamp").default("CURRENT_TIMESTAMP").notNull(),
  cpu: integer("cpu").notNull(),
  memory: integer("memory").notNull(),
  storage: text("storage").notNull(),  // JSON stored as string
  network: text("network").notNull(),
  services: text("services").notNull(), // JSON stored as string
});

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  lastLogin: true,
  createdAt: true,
});

export const insertCameraSchema = createInsertSchema(cameras).omit({
  id: true,
  createdAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  sent: true,
  sentAt: true,
  createdAt: true,
});

export const insertSystemStatSchema = createInsertSchema(systemStats).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCamera = z.infer<typeof insertCameraSchema>;
export type Camera = typeof cameras.$inferSelect;

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertSystemStat = z.infer<typeof insertSystemStatSchema>;
export type SystemStat = typeof systemStats.$inferSelect;
