import cv2
import numpy as np
import random
from typing import List, Dict, Any

from .yolo_sim import load_model

class AccidentDetector:
    """
    Class for detecting accidents in video frames using a YOLOv8 model.
    """
    
    def __init__(self):
        """Initialize the accident detector with a YOLOv8 model"""
        # Load the YOLO model
        self.model = load_model("yolov8n.pt")  # Simulated model
        self.accident_classes = self.model.accident_classes
        self.confidence_threshold = 0.5
        print("Accident detector initialized with YOLOv8 model")
    
    def detect(self, frame):
        """
        Detect accidents in a video frame using YOLOv8
        
        Args:
            frame: The video frame to process
            
        Returns:
            List of detections in format:
            [
                {
                    "label": class_name,
                    "confidence": confidence_score,
                    "x": x_coordinate,
                    "y": y_coordinate,
                    "width": width,
                    "height": height
                },
                ...
            ]
        """
        # Process the frame with YOLO
        yolo_detections = self.model.predict(frame)
        
        # Convert YOLO detections to our format
        detections = []
        for det in yolo_detections:
            x1, y1, x2, y2 = map(int, det["box"])
            
            detection = {
                "label": det["class_name"],
                "confidence": det["confidence"],
                "x": x1,
                "y": y1,
                "width": x2 - x1,
                "height": y2 - y1
            }
            
            # Only include detections above the threshold
            if det["confidence"] >= self.confidence_threshold:
                detections.append(detection)
        
        return detections
    
    def annotate_frame(self, frame, detections):
        """
        Draw bounding boxes and labels on the frame
        
        Args:
            frame: Original video frame
            detections: List of detection objects
            
        Returns:
            Annotated frame with bounding boxes and labels
        """
        # Use the model's annotation function directly
        yolo_detections = []
        for det in detections:
            x1 = det["x"]
            y1 = det["y"]
            x2 = x1 + det["width"]
            y2 = y1 + det["height"]
            
            yolo_det = {
                "class_name": det["label"],
                "confidence": det["confidence"],
                "box": [x1, y1, x2, y2]
            }
            yolo_detections.append(yolo_det)
        
        return self.model.annotate_frame(frame, yolo_detections)
    
    def is_accident(self, detections):
        """
        Check if any detections are classified as accidents
        
        Args:
            detections: List of detection objects
            
        Returns:
            True if an accident is detected, False otherwise
        """
        for det in detections:
            if det["label"] in self.accident_classes and det["confidence"] >= self.confidence_threshold:
                return True
        return False