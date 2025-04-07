import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIncidentSchema, insertCameraSchema, insertUserSchema, insertNotificationSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import * as http from "http";

// Variable to store the Python backend process
let pythonBackend: ChildProcessWithoutNullStreams | null = null;
let backendReady = false;

// Set up storage for uploaded videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// Configure the multer middleware for handling video uploads
const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mov|avi|mkv|webm/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only video files are allowed!"));
  },
});

// Function to start the Python backend
function startPythonBackend() {
  console.log("Starting Python backend...");
  
  // Make sure to stop any existing process first
  if (pythonBackend) {
    console.log("Stopping existing Python backend process");
    pythonBackend.kill('SIGKILL');  // Force kill to ensure port is released
    pythonBackend = null;
    backendReady = false;

    // Wait a bit to ensure port is released
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        startPythonProcess().then(resolve);
      }, 1000);
    });
  } else {
    return startPythonProcess();
  }
}

// Helper function to start the Python process
function startPythonProcess() {
  // Check if port 5001 is already in use
  try {
    // Start the Python process
    pythonBackend = spawn("python", ["backend/run.py"]);
    
    // Set up event listeners for the Python process
    pythonBackend.stdout.on("data", (data) => {
      console.log(`Python backend: ${data}`);
      // Check if the backend is ready
      if (data.toString().includes("Running on")) {
        backendReady = true;
        console.log("Python backend is ready");
      }
    });
    
    pythonBackend.stderr.on("data", (data) => {
      console.error(`Python backend error: ${data}`);
    });
    
    pythonBackend.on("close", (code) => {
      console.log(`Python backend process exited with code ${code}`);
      pythonBackend = null;
      backendReady = false;
    });
    
    // Wait a bit for the Python backend to start
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (!backendReady) {
          console.log("Python backend not ready yet, but continuing anyway");
        }
        resolve();
      }, 3000);
    });
  } catch (error) {
    console.error("Failed to start Python backend:", error);
    return Promise.resolve();
  }
}

// Proxy middleware to forward requests to the Python backend
function createProxyMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only proxy specific API endpoints to the Python backend
  const pythonRoutes = [
    '/api/status',
    '/api/system-stats',
    '/api/cameras',
    '/api/incidents',
    '/api/upload',
    '/api/videos',
    '/uploads/',
    '/processed/'
  ];
  
  const shouldProxy = pythonRoutes.some(route => 
    req.path.startsWith(route) || 
    (req.path.includes('/cameras/') && req.path.includes('/api')) ||
    (req.path.includes('/incidents/') && req.path.includes('/api'))
  );
  
  if (!shouldProxy) {
    return next();
  }
  
  // Make sure the backend is running
  if (!pythonBackend || !backendReady) {
    console.log("Python backend not running, starting it...");
    startPythonBackend().then(() => {
      // Rerun this middleware after starting the backend
      createProxyMiddleware(req, res, next);
    });
    return;
  }
  
  // Forward the request to the Python backend
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode || 500);
    
    // Copy headers from Python response
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      if (value) res.setHeader(key, value);
    }
    
    // Stream the response data
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (error) => {
    console.error("Proxy error:", error);
    if (!res.headersSent) {
      res.status(502).json({ 
        error: "Python backend error", 
        message: error.message 
      });
    }
  });
  
  // If there's request data, forward it
  if (req.body) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
  
  // Forward any form data for file uploads
  if (req.file) {
    // This would need a more complex implementation for file uploads
    // For now, we're handling uploads directly in Express
  }
  
  proxyReq.end();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the Python backend
  await startPythonBackend();
  
  // Add the proxy middleware
  app.use(createProxyMiddleware);
  
  // API routes for accident detection system
  const apiRouter = app.route("/api");

  // User endpoints
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Camera endpoints
  app.get("/api/cameras", async (req, res) => {
    try {
      const cameras = await storage.getAllCameras();
      res.json(cameras);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  app.get("/api/cameras/:id", async (req, res) => {
    try {
      const cameraId = parseInt(req.params.id);
      const camera = await storage.getCamera(cameraId);
      if (!camera) {
        return res.status(404).json({ message: "Camera not found" });
      }
      res.json(camera);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch camera" });
    }
  });

  app.post("/api/cameras", async (req, res) => {
    try {
      const cameraData = insertCameraSchema.parse(req.body);
      const camera = await storage.createCamera(cameraData);
      res.status(201).json(camera);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create camera" });
    }
  });

  // Incident endpoints
  app.get("/api/incidents", async (req, res) => {
    try {
      const incidents = await storage.getAllIncidents();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.get("/api/incidents/:id", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      const incident = await storage.getIncident(incidentId);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incident" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const incidentData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(incidentData);
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create incident" });
    }
  });

  app.patch("/api/incidents/:id/review", async (req, res) => {
    try {
      const incidentId = parseInt(req.params.id);
      const incident = await storage.reviewIncident(incidentId);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(500).json({ message: "Failed to update incident" });
    }
  });

  // Notification endpoints
  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  // System stats endpoint
  app.get("/api/system/stats", async (req, res) => {
    try {
      const stats = await storage.getLatestSystemStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system stats" });
    }
  });

  // Video upload endpoint
  app.post("/api/videos/upload", uploadVideo.single("video"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No video file uploaded" });
      }

      // Return the file info for frontend use
      const fileInfo = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: `/api/videos/${req.file.filename}`,
        size: req.file.size,
        mimetype: req.file.mimetype,
      };

      res.status(201).json({ 
        message: "Video uploaded successfully", 
        file: fileInfo 
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Failed to upload video" });
    }
  });

  // Get list of uploaded videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videosDir = "uploads/videos";
      fs.readdir(videosDir, (err, files) => {
        if (err) {
          console.error("Error reading videos directory:", err);
          return res.status(500).json({ message: "Failed to read videos directory" });
        }

        const videos = files.map(filename => ({
          filename,
          path: `/api/videos/${filename}`
        }));

        res.json(videos);
      });
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Serve video files
  app.get("/api/videos/:filename", (req, res) => {
    const filename = req.params.filename;
    const videoPath = path.join("uploads/videos", filename);

    // Check if file exists
    fs.access(videoPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Stream the video file
      const stat = fs.statSync(videoPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        // Handle range requests for video streaming
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        // Send entire file
        const head = {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
      }
    });
  });

  const httpServer = createServer(app);
  
  // Clean up Python process on server shutdown
  httpServer.on("close", () => {
    if (pythonBackend) {
      console.log("Shutting down Python backend...");
      pythonBackend.kill('SIGKILL');  // Force kill to ensure port is released
      pythonBackend = null;
      backendReady = false;
    }
  });
  
  return httpServer;
}
