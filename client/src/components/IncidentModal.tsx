import { useState } from "react";
import { X, Play, Pause, Repeat, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Incident } from "@/lib/types";

interface IncidentModalProps {
  camera: Camera;
  incident?: Incident;
  onClose: () => void;
}

export default function IncidentModal({ 
  camera, 
  incident, 
  onClose 
}: IncidentModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleMarkAsReviewed = () => {
    // This would update the incident status in a real implementation
    console.log("Marking incident as reviewed");
    onClose();
  };
  
  const handleReportEmergency = () => {
    // This would trigger an emergency response in a real implementation
    console.log("Reporting emergency");
  };
  
  const handleDownloadClip = () => {
    // This would download the incident clip in a real implementation
    console.log("Downloading incident clip");
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Incident Details - {incident?.type || "Vehicle Collision"}
          </DialogTitle>
          <DialogDescription>
            {camera.name} - {new Date().toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div>
            <div className="video-container bg-gray-900">
              {/* Video clip would be rendered here */}
              <div className="w-full h-full">
                {camera.streamUrl ? (
                  <video 
                    src={camera.streamUrl} 
                    className="w-full h-full object-cover"
                    autoPlay={isPlaying}
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    No video feed available
                  </div>
                )}
              </div>
              
              {/* Detection overlay */}
              <div className="video-overlay">
                {camera.detections.map((detection, index) => (
                  <div 
                    key={index}
                    className="bounding-box" 
                    style={{
                      top: `${detection.y}%`,
                      left: `${detection.x}%`,
                      width: `${detection.width}%`,
                      height: `${detection.height}%`
                    }}
                  >
                    <div className="absolute top-0 left-0 bg-destructive text-white text-xs px-1 rounded-sm">
                      {detection.label}: {detection.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-2">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={togglePlayback}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon">
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={handleDownloadClip}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Clip
              </Button>
            </div>
          </div>
          
          <div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Incident Information</h3>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Date & Time:</span>
                    <span className="text-sm font-medium">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Location:</span>
                    <span className="text-sm font-medium">{camera.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Detection Type:</span>
                    <span className="text-sm font-medium">
                      {camera.detections[0]?.label || "Vehicle Collision"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Confidence Score:</span>
                    <span className="text-sm font-medium">
                      {camera.detections[0]?.confidence || 97}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Severity:</span>
                    <span className="text-sm font-medium text-destructive">High</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Details</h3>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Vehicles Involved:</span>
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">People Detected:</span>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Notifications Sent:</span>
                      <span className="text-sm font-medium">Yes (3 recipients)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded p-3 h-32">
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Location map would be rendered here
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleMarkAsReviewed}
          >
            Mark as Reviewed
          </Button>
          <div>
            <Button 
              variant="destructive" 
              className="mr-2"
              onClick={handleReportEmergency}
            >
              Report Emergency
            </Button>
            <Button 
              variant="secondary" 
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
