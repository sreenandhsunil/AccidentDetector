import { useEffect, useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapIncident } from "@/lib/types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons for different severity levels
const createSeverityIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface LocationMapProps {
  incidents: MapIncident[];
}

// Default center coordinates for the map
const defaultCenter: [number, number] = [34.0522, -118.2437]; // Los Angeles coordinates

// Component to recenter map based on incidents
function MapController({ incidents }: { incidents: MapIncident[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (incidents.length > 0) {
      // Create bounds that include all incidents
      const bounds = L.latLngBounds([]);
      incidents.forEach(incident => {
        // Convert percentage to actual lat/lng (simplified conversion for demo)
        // In a real app, you would have actual lat/lng coordinates
        const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
        const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
        bounds.extend([lat, lng] as L.LatLngExpression);
      });
      
      // Fit map to bounds with some padding
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [incidents, map]);
  
  return null;
}

export default function LocationMap({ incidents }: LocationMapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Set map as ready after component mounts
    setMapReady(true);
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
          className="relative rounded overflow-hidden mb-4"
          style={{ height: "240px", width: "100%" }}
        >
          {mapReady && (
            <MapContainer 
              center={defaultCenter} 
              zoom={12} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {incidents.map((incident) => {
                // Convert percentage to actual lat/lng (simplified conversion for demo)
                const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
                const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
                const position: [number, number] = [lat, lng];
                
                // Choose icon based on severity
                let icon;
                if (incident.severity === "high") {
                  icon = createSeverityIcon("var(--destructive, #ef4444)");
                } else if (incident.severity === "medium") {
                  icon = createSeverityIcon("#F59E0B");
                } else {
                  icon = createSeverityIcon("#10B981");
                }
                
                return (
                  <Marker 
                    key={incident.id} 
                    position={position} 
                    icon={icon}
                  >
                    <Popup>
                      <div className="p-1">
                        <p className="font-semibold">{incident.location}</p>
                        <p className="text-sm">Type: {incident.type}</p>
                        <p className="text-sm capitalize">
                          Severity: <span className={
                            incident.severity === "high" 
                              ? "text-red-500" 
                              : incident.severity === "medium" 
                                ? "text-amber-500" 
                                : "text-green-500"
                          }>{incident.severity}</span>
                        </p>
                        <p className="text-sm">Camera ID: {incident.cameraId}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              <MapController incidents={incidents} />
            </MapContainer>
          )}
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
