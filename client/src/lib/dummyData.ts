import { Camera, Incident, MapIncident, SystemStats, IncidentStat } from "./types";

// Sample cameras data
export const cameras: Camera[] = [
  {
    id: "cam1",
    name: "Camera 1 - Highway Junction",
    location: "Highway Junction",
    status: "incident",
    detections: [
      {
        label: "Accident",
        confidence: 97,
        x: 30,
        y: 50,
        width: 40,
        height: 30
      }
    ]
  },
  {
    id: "cam2",
    name: "Camera 2 - Parking Lot North",
    location: "Parking Lot North",
    status: "monitoring",
    detections: []
  },
  {
    id: "cam3",
    name: "Camera 3 - Main Intersection",
    location: "Main Intersection",
    status: "monitoring",
    detections: []
  }
];

// Sample incidents data
export const incidents: Incident[] = [
  {
    id: "inc1",
    cameraId: "cam1",
    location: "Camera 1 - Highway Junction",
    timestamp: "2023-05-12T13:42:15",
    timeAgo: "2 minutes ago",
    type: "Vehicle Collision",
    severity: "high",
    detections: [
      {
        label: "Accident",
        confidence: 97,
        x: 30,
        y: 50,
        width: 40,
        height: 30
      }
    ],
    details: {
      vehiclesInvolved: 2,
      peopleDetected: 3,
      notificationsSent: true,
      notificationRecipients: 3
    }
  },
  {
    id: "inc2",
    cameraId: "cam2",
    location: "Camera 2 - Parking Lot North",
    timestamp: "2023-05-12T13:17:32",
    timeAgo: "25 minutes ago",
    type: "Vehicle-Pedestrian",
    severity: "medium",
    detections: [
      {
        label: "Near Miss",
        confidence: 85,
        x: 45,
        y: 60,
        width: 30,
        height: 25
      }
    ]
  },
  {
    id: "inc3",
    cameraId: "cam3",
    location: "Camera 3 - Main Intersection",
    timestamp: "2023-05-12T11:42:15",
    timeAgo: "2 hours ago",
    type: "Near Miss",
    severity: "low",
    detections: [
      {
        label: "Near Miss",
        confidence: 78,
        x: 55,
        y: 45,
        width: 25,
        height: 20
      }
    ]
  }
];

// Sample map incidents data
export const mapIncidents: MapIncident[] = [
  {
    id: "map1",
    cameraId: "1",
    location: "Camera 1: Vehicle Collision",
    type: "Vehicle Collision",
    severity: "high",
    x: 25,
    y: 33
  },
  {
    id: "map2",
    cameraId: "2",
    location: "Camera 2: Vehicle-Pedestrian",
    type: "Vehicle-Pedestrian",
    severity: "medium",
    x: 67,
    y: 75
  }
];

// Sample system statistics
export const systemStats: SystemStats = {
  cpu: 42,
  memory: 68,
  storage: {
    used: "12.4 GB",
    total: "500 GB",
    percentage: 23
  },
  network: "8.2 Mbps",
  networkLoad: 55,
  services: {
    model: "active",
    database: "connected",
    notifications: "running"
  }
};

// Sample incident statistics
export const incidentStats: IncidentStat[] = [
  {
    period: "today",
    label: "Today",
    count: 3,
    trend: 2
  },
  {
    period: "week",
    label: "This Week",
    count: 12,
    trend: -5
  },
  {
    period: "month",
    label: "This Month",
    count: 37,
    trend: 0
  },
  {
    period: "today",
    label: "Yesterday",
    count: 1,
    trend: -2
  },
  {
    period: "week",
    label: "Last Week",
    count: 17,
    trend: 4
  },
  {
    period: "month",
    label: "Last Month",
    count: 37,
    trend: 5
  }
];
