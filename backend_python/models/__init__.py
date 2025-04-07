# This file makes the models directory a Python package
from .detector import AccidentDetector
from .yolo_sim import load_model, YOLOv8Simulator

__all__ = ['AccidentDetector', 'load_model', 'YOLOv8Simulator']