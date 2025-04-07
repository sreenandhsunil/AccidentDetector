import cv2
import numpy as np
import random
import time
from typing import List, Dict, Any, Tuple

class YOLOv8Simulator:
    """
    A simulator for YOLOv8 accident detection model.
    Since we can't install the actual ultralytics package, this simulates its behavior.
    """
    
    def __init__(self, model_path: str = None):
        """
        Initialize a simulated YOLOv8 model
        
        Args:
            model_path: Path to a YOLOv8 model file (ignored in simulation)
        """
        self.classes = [
            "person", "bicycle", "car", "motorcycle", "bus", "truck",
            "traffic light", "fire hydrant", "stop sign", "vehicle collision",
            "person fall", "accident", "traffic accident", "fire", "smoke"
        ]
        
        self.accident_classes = ["vehicle collision", "person fall", "accident", "traffic accident"]
        self.confidence_threshold = 0.5
        self.initialized = True
        print(f"YOLOv8 model simulator initialized with {len(self.classes)} classes")
    
    def predict(self, frame: np.ndarray, size: Tuple[int, int] = (640, 640)) -> List[Dict[str, Any]]:
        """
        Simulate YOLOv8 prediction on a frame
        
        Args:
            frame: Input image (numpy array)
            size: Input size for the model (ignored in simulation)
            
        Returns:
            List of detection dictionaries with format:
            [
                {
                    "class": class_index,
                    "class_name": class_name,
                    "confidence": confidence_score,
                    "box": [x1, y1, x2, y2]  # in pixel coordinates
                },
                ...
            ]
        """
        # Simulate processing time
        time.sleep(0.1)
        
        # Get frame dimensions
        height, width = frame.shape[:2]
        
        # Create random detections
        detections = []
        
        # Always detect some normal objects (cars, people, etc.)
        normal_object_count = random.randint(1, 5)
        for _ in range(normal_object_count):
            # Choose a random class that's not an accident
            class_id = random.randint(0, len(self.classes) - 1)
            while self.classes[class_id] in self.accident_classes:
                class_id = random.randint(0, len(self.classes) - 1)
            
            # Create random bounding box
            x1 = random.randint(0, width - 100)
            y1 = random.randint(0, height - 100)
            box_width = random.randint(50, 200)
            box_height = random.randint(50, 200)
            x2 = min(width, x1 + box_width)
            y2 = min(height, y1 + box_height)
            
            # Add detection with medium-high confidence
            confidence = random.uniform(0.6, 0.9)
            detections.append({
                "class": class_id,
                "class_name": self.classes[class_id],
                "confidence": confidence,
                "box": [x1, y1, x2, y2]
            })
        
        # Occasionally detect an accident (2% chance)
        if random.random() < 0.02:
            # Choose a random accident class
            class_id = self.classes.index(random.choice(self.accident_classes))
            
            # Create random bounding box for the accident
            x1 = random.randint(0, width - 150)
            y1 = random.randint(0, height - 150)
            box_width = random.randint(100, 250)
            box_height = random.randint(100, 250)
            x2 = min(width, x1 + box_width)
            y2 = min(height, y1 + box_height)
            
            # Add accident detection with high confidence
            confidence = random.uniform(0.75, 0.98)
            detections.append({
                "class": class_id,
                "class_name": self.classes[class_id],
                "confidence": confidence,
                "box": [x1, y1, x2, y2]
            })
        
        return detections
    
    def annotate_frame(self, frame: np.ndarray, detections: List[Dict[str, Any]]) -> np.ndarray:
        """
        Draw detection boxes and labels on the frame
        
        Args:
            frame: Original video frame
            detections: List of detection dictionaries from predict()
            
        Returns:
            Annotated frame with bounding boxes and labels
        """
        annotated = frame.copy()
        
        for det in detections:
            # Extract coordinates
            x1, y1, x2, y2 = map(int, det["box"])
            class_name = det["class_name"]
            confidence = det["confidence"]
            
            # Red color for accidents, green for other objects
            if class_name in self.accident_classes:
                color = (0, 0, 255)  # Red for accidents
            else:
                color = (0, 255, 0)  # Green for normal objects
            
            # Draw bounding box
            cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 2)
            
            # Add label with confidence
            label = f"{class_name}: {confidence:.2f}"
            cv2.putText(annotated, label, (x1, y1 - 10),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
            
            # Add accident warning if detected
            if class_name in self.accident_classes:
                cv2.putText(annotated, "ACCIDENT DETECTED", (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        
        return annotated

# Function to simulate YOLO model loading
def load_model(model_path=None):
    """
    Simulate loading a YOLOv8 model
    
    Args:
        model_path: Path to model weights (ignored in simulation)
        
    Returns:
        A YOLOv8Simulator instance
    """
    print(f"Loading YOLOv8 model (simulated): {model_path}")
    return YOLOv8Simulator(model_path)