// Camera and Detection types
export type DetectionStatus = "monitoring" | "warning" | "incident";

export interface Detection {
  label: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  status: DetectionStatus;
  streamUrl?: string;
  detections: Detection[];
}

// Incident types
export interface Incident {
  id: string;
  cameraId: string;
  location: string;
  timestamp: string;
  timeAgo: string;
  type: string;
  severity: string;
  imageUrl?: string;
  videoUrl?: string;
  detections: Detection[];
  details?: {
    vehiclesInvolved?: number;
    peopleDetected?: number;
    notificationsSent?: boolean;
    notificationRecipients?: number;
  };
}

// Map-related types
export interface MapIncident {
  id: string;
  cameraId: string;
  location: string;
  type: string;
  severity: "high" | "medium" | "low";
  x: number;
  y: number;
}

// System statistics types
export interface SystemStats {
  cpu: number;
  memory: number;
  storage: {
    used: string;
    total: string;
    percentage: number;
  };
  network: string;
  networkLoad: number;
  services: {
    model: "active" | "inactive";
    database: "connected" | "disconnected";
    notifications: "running" | "stopped";
  };
}

// Statistics types
export type StatPeriod = "today" | "week" | "month";

export interface IncidentStat {
  period: StatPeriod;
  label: string;
  count: number;
  trend: number;
}

// User types
export interface User {
  id: string;
  name: string;
  username: string;
  role: "admin" | "operator" | "viewer";
  email: string;
}
