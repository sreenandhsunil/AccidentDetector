from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
import time
import random
import numpy as np
import cv2
from datetime import datetime
import threading
import logging
from dotenv import load_dotenv

# Import our simulated YOLO model
from models.yolo_sim import load_model

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
MODEL_PATH = 'backend/models'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}

# Create necessary directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)
os.makedirs(MODEL_PATH, exist_ok=True)

# Global variables for system state
system_state = {
    "cpu_usage": 0,
    "memory_usage": 0,
    "storage_used": "0 GB",
    "storage_total": "100 GB",
    "storage_percentage": 0,
    "network_speed": "0 Mbps",
    "network_load": 0,
    "services": {
        "model": "active",
        "database": "connected",
        "notifications": "running"
    },
    "last_updated": datetime.now().isoformat()
}

# Mock data for cameras and incidents (will be replaced with actual detection)
cameras = {
    "cam1": {
        "id": "cam1",
        "name": "Highway Junction A",
        "location": "I-95 North, Mile 42",
        "status": "monitoring",
        "detections": []
    },
    "cam2": {
        "id": "cam2",
        "name": "City Center",
        "location": "Main St & 5th Ave",
        "status": "monitoring",
        "detections": []
    },
    "cam3": {
        "id": "cam3",
        "name": "Industrial Park",
        "location": "Warehouse District, Lot C",
        "status": "monitoring",
        "detections": []
    },
    "cam4": {
        "id": "cam4",
        "name": "Residential Area",
        "location": "Oak Street & Elm Drive",
        "status": "monitoring",
        "detections": []
    }
}

incidents = []
current_incident_id = 1

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_video(video_path, camera_id):
    """Process a video file to detect accidents using our simulated YOLOv8 model"""
    global current_incident_id
    logger.info(f"Processing video: {video_path} for camera {camera_id}")
    
    # Load the YOLO model
    yolo_model = load_model("yolov8n.pt")  # The path is not used in our simulation
    
    # Open the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        logger.error(f"Error opening video file: {video_path}")
        return
    
    frame_count = 0
    processed_frames = 0
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    processing_interval = max(1, int(fps / 4))  # Process every X frames
    
    # Update camera status to reflect that processing has started
    cameras[camera_id]['status'] = "monitoring"
    
    # Keep track of when we last triggered an incident
    last_incident_time = 0
    min_incident_interval = 5  # Minimum seconds between incidents
    output_writer = None
    output_video_path = None
    
    # For saving video clips of incidents
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        frame_count += 1
        
        # Process every X frames to improve performance
        if frame_count % processing_interval != 0:
            continue
        
        processed_frames += 1
        
        # Run YOLO detection on the frame
        detections = yolo_model.predict(frame)
        
        # Draw annotations on the frame for visualization
        annotated_frame = yolo_model.annotate_frame(frame, detections)
        
        # Check if any detections are accidents
        accident_detections = [d for d in detections if d["class_name"] in yolo_model.accident_classes]
        
        current_time = time.time()
        incident_detected = len(accident_detections) > 0 and (current_time - last_incident_time > min_incident_interval)
        
        if incident_detected:
            last_incident_time = current_time
            
            # Get the most confident accident detection
            accident = max(accident_detections, key=lambda x: x["confidence"])
            accident_type = accident["class_name"]
            x1, y1, x2, y2 = map(int, accident["box"])
            
            # Convert YOLO detection to our detection format
            detection = {
                "label": accident_type,
                "confidence": accident["confidence"],
                "x": x1,
                "y": y1,
                "width": x2 - x1,
                "height": y2 - y1
            }
            
            # Save frame as image
            incident_timestamp = datetime.now()
            image_filename = f"incident_{current_incident_id}_{incident_timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
            image_path = os.path.join(PROCESSED_FOLDER, image_filename)
            cv2.imwrite(image_path, annotated_frame)
            
            # Create video clip for the incident
            video_filename = f"incident_{current_incident_id}_{incident_timestamp.strftime('%Y%m%d_%H%M%S')}.mp4"
            output_video_path = os.path.join(PROCESSED_FOLDER, video_filename)
            
            # Save a 5-second clip (continued in next iterations)
            frame_height, frame_width = frame.shape[:2]
            output_writer = cv2.VideoWriter(
                output_video_path, fourcc, fps, 
                (frame_width, frame_height)
            )
            
            # Write the current annotated frame
            if output_writer.isOpened():
                output_writer.write(annotated_frame)
            
            # Update camera status
            cameras[camera_id]['status'] = "incident"
            cameras[camera_id]['detections'] = [detection]
            
            # Create incident record
            timestamp = incident_timestamp.isoformat()
            timeAgo = "just now"
            
            # Get severity based on confidence
            severity = "low"
            if accident["confidence"] > 0.85:
                severity = "high"
            elif accident["confidence"] > 0.7:
                severity = "medium"
            
            # Create new incident
            new_incident = {
                "id": str(current_incident_id),
                "cameraId": camera_id,
                "location": cameras[camera_id]["location"],
                "timestamp": timestamp,
                "timeAgo": timeAgo,
                "type": accident_type,
                "severity": severity,
                "imageUrl": f"/processed/{image_filename}",
                "videoUrl": f"/processed/{video_filename}",
                "detections": [detection],
                "details": {
                    "vehiclesInvolved": random.randint(1, 3),
                    "peopleDetected": random.randint(0, 5),
                    "notificationsSent": True,
                    "notificationRecipients": random.randint(1, 5)
                }
            }
            
            # Add to incidents list
            incidents.append(new_incident)
            current_incident_id += 1
            
            # Log the detection
            logger.info(f"Accident detected: {accident_type} at {timestamp} on camera {camera_id}")
        elif output_writer is not None and output_writer.isOpened():
            # Continue writing frames to the incident clip for a short duration
            output_writer.write(annotated_frame)
            
            # Close the video writer after some frames to limit clip length
            if frame_count % (fps * 3) == 0:  # Approximately 3 seconds of video
                output_writer.release()
                output_writer = None
                logger.info(f"Saved incident clip: {output_video_path}")
        else:
            # Update camera status to normal monitoring if some time has passed
            if cameras[camera_id]['status'] == "incident" and (current_time - last_incident_time > 3):
                cameras[camera_id]['status'] = "monitoring"
                cameras[camera_id]['detections'] = []
        
        # Update system stats periodically
        if processed_frames % 10 == 0:
            update_system_stats()
    
    # Make sure to release the video writer if it's still open
    if output_writer is not None and output_writer.isOpened():
        output_writer.release()
    
    # Release the video
    cap.release()
    logger.info(f"Finished processing video. Processed {processed_frames} frames out of {total_frames} total frames.")

def update_system_stats():
    """Update system statistics"""
    global system_state
    
    # In a real system, we would get actual system metrics
    # For demonstration, we'll simulate changing values
    system_state["cpu_usage"] = min(95, max(5, system_state["cpu_usage"] + random.uniform(-5, 5)))
    system_state["memory_usage"] = min(95, max(20, system_state["memory_usage"] + random.uniform(-3, 3)))
    
    # Simulate storage
    used_gb = float(system_state["storage_used"].split()[0])
    total_gb = float(system_state["storage_total"].split()[0])
    used_gb = min(total_gb, max(0.1, used_gb + random.uniform(-0.1, 0.2)))
    system_state["storage_used"] = f"{used_gb:.1f} GB"
    system_state["storage_percentage"] = (used_gb / total_gb) * 100
    
    # Network metrics
    system_state["network_speed"] = f"{random.randint(10, 200)} Mbps"
    system_state["network_load"] = min(100, max(0, system_state["network_load"] + random.uniform(-10, 10)))
    
    # Update timestamp
    system_state["last_updated"] = datetime.now().isoformat()

# Start a background thread to periodically update system stats
def system_stats_updater():
    while True:
        update_system_stats()
        time.sleep(5)  # Update every 5 seconds

# Routes
@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({"status": "running", "message": "AI Accident Detection System is operational"})

@app.route('/api/system-stats', methods=['GET'])
def get_system_stats():
    return jsonify(system_state)

@app.route('/api/cameras', methods=['GET'])
def get_cameras():
    return jsonify(list(cameras.values()))

@app.route('/api/cameras/<camera_id>', methods=['GET'])
def get_camera(camera_id):
    if camera_id in cameras:
        return jsonify(cameras[camera_id])
    return jsonify({"error": "Camera not found"}), 404

@app.route('/api/incidents', methods=['GET'])
def get_incidents():
    return jsonify(incidents)

@app.route('/api/incidents/<incident_id>', methods=['GET'])
def get_incident(incident_id):
    for incident in incidents:
        if incident['id'] == incident_id:
            return jsonify(incident)
    return jsonify({"error": "Incident not found"}), 404

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    camera_id = request.form.get('cameraId', 'cam1')  # Default to cam1 if not specified
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = f"{int(time.time())}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Process the video in a separate thread
        threading.Thread(target=process_video, args=(filepath, camera_id)).start()
        
        return jsonify({
            "message": "File uploaded successfully",
            "filename": filename,
            "path": filepath,
            "cameraId": camera_id
        })
    
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/videos', methods=['GET'])
def get_videos():
    videos = []
    for filename in os.listdir(UPLOAD_FOLDER):
        if any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS):
            videos.append({
                "filename": filename,
                "path": f"/uploads/{filename}"
            })
    return jsonify(videos)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/processed/<filename>')
def processed_file(filename):
    return send_from_directory(PROCESSED_FOLDER, filename)

# Start the background thread for system stats updates
stats_thread = threading.Thread(target=system_stats_updater, daemon=True)
stats_thread.start()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)