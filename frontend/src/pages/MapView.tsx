import { useState, useEffect } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Filter, Calendar, MapPin } from "lucide-react";
import { mapIncidents, incidents } from "@/lib/dummyData";
import IncidentModal from "@/components/IncidentModal";
import { Incident, MapIncident } from "@/lib/types";
import { cameras } from "@/lib/dummyData";
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
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Heat map layer creator
const createHeatLayer = (incidents: MapIncident[]) => {
  // This is a simplified heatmap effect
  // In a real app, you would use a proper heatmap plugin like Leaflet.heat
  return incidents.map((incident, index) => {
    // Convert percentage to actual lat/lng
    const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
    const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
    
    // Create a circle with radius based on incident severity
    const radius = incident.severity === "high" ? 300 : 
                  incident.severity === "medium" ? 200 : 100;
    
    const color = incident.severity === "high" ? "rgba(239, 68, 68, 0.3)" : 
                 incident.severity === "medium" ? "rgba(245, 158, 11, 0.3)" : 
                 "rgba(16, 185, 129, 0.3)";
    
    return L.circle([lat, lng] as L.LatLngExpression, {
      radius,
      color: "transparent",
      fillColor: color,
      fillOpacity: 0.7,
    });
  });
};

// Component to control map view based on incidents
function MapController({ incidents }: { incidents: MapIncident[] }) {
  const map = useMap();
  
  // Set map bounds to include all incidents
  if (incidents.length > 0) {
    const bounds = L.latLngBounds([]);
    incidents.forEach(incident => {
      const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
      const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
      bounds.extend([lat, lng] as L.LatLngExpression);
    });
    
    // Use timeout to ensure map is initialized before fitting bounds
    setTimeout(() => {
      map.fitBounds(bounds, { padding: [50, 50] });
    }, 100);
  }
  
  return null;
}

export default function MapView() {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [incidentTypeFilter, setIncidentTypeFilter] = useState("all");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mapReady, setMapReady] = useState(true);

  // Filter map incidents based on selected filters
  const filteredIncidents = mapIncidents.filter(incident => {
    // Filter by incident type
    if (incidentTypeFilter !== "all") {
      const typeMatches = incident.type.toLowerCase().includes(incidentTypeFilter.toLowerCase());
      if (!typeMatches) return false;
    }
    
    // Time filtering would be implemented here with real data
    return true;
  });

  const handleIncidentClick = (incidentId: string) => {
    const incident = incidents.find(inc => inc.id === incidentId);
    if (incident) {
      setSelectedIncident(incident);
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedIncident(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Incident Map View</h1>
      
      <Card className="mb-4">
        <CardHeader className="p-4 border-b">
          <CardTitle className="text-lg">Map Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex space-x-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={incidentTypeFilter} onValueChange={setIncidentTypeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Incident type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="collision">Vehicle Collision</SelectItem>
                  <SelectItem value="pedestrian">Vehicle-Pedestrian</SelectItem>
                  <SelectItem value="nearmiss">Near Miss</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="heatmap" 
                  checked={showHeatmap}
                  onCheckedChange={setShowHeatmap}
                />
                <Label htmlFor="heatmap">Heatmap View</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="satellite">Satellite View</TabsTrigger>
        </TabsList>
        <TabsContent value="map" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-[600px] relative">
                {mapReady && (
                  <MapContainer 
                    center={[34.0522, -118.2437]} 
                    zoom={12} 
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Render heatmap or markers based on toggle */}
                    {showHeatmap ? (
                      // Use special heat markers to simulate a heatmap effect
                      filteredIncidents.map((incident, index) => {
                        const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
                        const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
                        const position: [number, number] = [lat, lng];
                        
                        const size = incident.severity === "high" ? 50 : 
                                    incident.severity === "medium" ? 40 : 30;
                        
                        const color = incident.severity === "high" ? "rgba(239, 68, 68, 0.7)" : 
                                     incident.severity === "medium" ? "rgba(245, 158, 11, 0.7)" : 
                                     "rgba(16, 185, 129, 0.7)";
                        
                        // Create a heat blob icon
                        const heatIcon = L.divIcon({
                          className: "heat-icon",
                          html: `<div style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 10px 5px ${color}"></div>`,
                          iconSize: [size, size],
                          iconAnchor: [size/2, size/2],
                        });
                        
                        return (
                          <Marker
                            key={`heat-${incident.id}`}
                            position={position}
                            icon={heatIcon}
                            eventHandlers={{
                              click: () => handleIncidentClick(incident.id)
                            }}
                          >
                            <Popup>
                              <div className="p-2">
                                <p className="font-semibold">{incident.location}</p>
                                <p className="text-sm">Type: {incident.type}</p>
                                <p className="text-sm">Severity: {incident.severity}</p>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })
                    ) : (
                      // Standard markers
                      filteredIncidents.map((incident) => {
                        const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
                        const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
                        
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
                            position={[lat, lng] as [number, number]} 
                            icon={icon}
                            eventHandlers={{
                              click: () => handleIncidentClick(incident.id)
                            }}
                          >
                            <Popup>
                              <div className="p-2">
                                <p className="font-semibold">{incident.location}</p>
                                <p className="text-sm">Type: {incident.type}</p>
                                <p className="text-sm capitalize">
                                  Severity: <span className={
                                    incident.severity === "high" 
                                      ? "text-red-500 font-medium" 
                                      : incident.severity === "medium" 
                                        ? "text-amber-500 font-medium" 
                                        : "text-green-500 font-medium"
                                  }>{incident.severity}</span>
                                </p>
                                <button 
                                  className="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90"
                                  onClick={() => handleIncidentClick(incident.id)}
                                >
                                  View Details
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })
                    )}
                    
                    <MapController incidents={filteredIncidents} />
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="satellite" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-[600px]">
                {mapReady && (
                  <MapContainer
                    center={[34.0522, -118.2437]}
                    zoom={12}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    />
                    
                    {filteredIncidents.map((incident) => {
                      const lat = 34.0522 + (incident.y / 100 - 0.5) * 0.1;
                      const lng = -118.2437 + (incident.x / 100 - 0.5) * 0.1;
                      
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
                          position={[lat, lng] as [number, number]} 
                          icon={icon}
                          eventHandlers={{
                            click: () => handleIncidentClick(incident.id)
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <p className="font-semibold">{incident.location}</p>
                              <p className="text-sm">Type: {incident.type}</p>
                              <p className="text-sm capitalize">
                                Severity: <span className={
                                  incident.severity === "high" 
                                    ? "text-red-500 font-medium" 
                                    : incident.severity === "medium" 
                                      ? "text-amber-500 font-medium" 
                                      : "text-green-500 font-medium"
                                }>{incident.severity}</span>
                              </p>
                              <button 
                                className="mt-2 px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary/90"
                                onClick={() => handleIncidentClick(incident.id)}
                              >
                                View Details
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                    
                    <MapController incidents={filteredIncidents} />
                  </MapContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">High Severity Incidents</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-semibold">
              {incidents.filter(i => i.severity.toLowerCase() === "high").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Medium Severity Incidents</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-semibold">
              {incidents.filter(i => i.severity.toLowerCase() === "medium").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Low Severity Incidents</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-2xl font-semibold">
              {incidents.filter(i => i.severity.toLowerCase() === "low").length}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showModal && selectedIncident && (
        <IncidentModal
          camera={cameras.find(c => c.id === selectedIncident.cameraId)!}
          incident={selectedIncident}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
