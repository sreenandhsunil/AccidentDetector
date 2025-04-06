import { useState } from "react";
import { Maximize, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Camera, DetectionStatus } from "@/lib/types";

interface VideoFeedProps {
  camera: Camera;
  onFullscreen: (cameraId: string) => void;
  onSettings: (cameraId: string) => void;
}

export default function VideoFeed({ 
  camera, 
  onFullscreen, 
  onSettings 
}: VideoFeedProps) {
  // Status indicator styling based on detection status
  const getStatusColor = (status: DetectionStatus) => {
    switch (status) {
      case "incident":
        return "bg-destructive incident-animation";
      case "warning":
        return "bg-amber-500";
      default:
        return "bg-green-500";
    }
  };

  // Status text based on detection status
  const getStatusText = (status: DetectionStatus) => {
    switch (status) {
      case "incident":
        return "Incident Detected";
      case "warning":
        return "Possible Incident";
      default:
        return "Monitoring";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 flex-row justify-between items-center space-y-0 border-b">
        <div className="flex items-center">
          <span 
            className={cn(
              "w-2 h-2 rounded-full mr-2", 
              getStatusColor(camera.status)
            )}
          ></span>
          <h3 className="font-medium text-sm">{camera.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => onFullscreen(camera.id)}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Full screen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => onSettings(camera.id)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="video-container bg-gray-900">
          {/* Video stream would be rendered here */}
          <div className="w-full h-full">
            {camera.streamUrl ? (
              <video 
                src={camera.streamUrl} 
                className="w-full h-full object-cover"
                autoPlay 
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
      </CardContent>
      
      <CardFooter className="p-3 bg-gray-50 dark:bg-gray-800 text-sm justify-between">
        <span>
          Status: <Badge variant={camera.status === "incident" ? "destructive" : "outline"} className="ml-1">
            {getStatusText(camera.status)}
          </Badge>
        </span>
        <span>
          Confidence: <span className="font-medium">
            {camera.detections.length > 0 
              ? `${Math.max(...camera.detections.map(d => d.confidence))}%` 
              : "N/A"}
          </span>
        </span>
      </CardFooter>
    </Card>
  );
}
