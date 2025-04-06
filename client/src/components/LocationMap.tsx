import { useEffect, useRef } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapIncident } from "@/lib/types";

interface LocationMapProps {
  incidents: MapIncident[];
}

export default function LocationMap({ incidents }: LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // This would initialize the map library in a real implementation
  useEffect(() => {
    // Map initialization would go here with leaflet or another mapping library
    const initMap = () => {
      if (mapContainerRef.current) {
        console.log("Map would be initialized here");
        // Integration with a map library would happen here
      }
    };
    
    initMap();
  }, []);

  // Count incidents by severity
  const highSeverity = incidents.filter(i => i.severity === "high").length;
  const mediumSeverity = incidents.filter(i => i.severity === "medium").length;
  const lowSeverity = incidents.filter(i => i.severity === "low").length;

  return (
    <Card className="shadow">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-base font-semibold">Incident Locations</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div 
          ref={mapContainerRef}
          className="relative h-60 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden mb-4"
          style={{ aspectRatio: "16/9" }}
        >
          {/* Map would be rendered here by the mapping library */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Interactive map would be rendered here
          </div>
          
          {/* Sample incident markers - these would be placed by the mapping library in reality */}
          {incidents.map((incident) => (
            <div 
              key={incident.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs`}
              style={{
                top: `${incident.y}%`,
                left: `${incident.x}%`,
                backgroundColor: incident.severity === "high" 
                  ? "var(--destructive)" 
                  : incident.severity === "medium" 
                    ? "#F59E0B" 
                    : "#10B981",
                transform: "translate(-50%, -50%)"
              }}
              title={`${incident.location}: ${incident.type}`}
            >
              {incident.cameraId}
            </div>
          ))}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-destructive mr-2"></span>
              <span>High Severity</span>
            </div>
            <span className="font-medium">{highSeverity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
              <span>Medium Severity</span>
            </div>
            <span className="font-medium">{mediumSeverity}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span>Low Severity</span>
            </div>
            <span className="font-medium">{lowSeverity}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
