import { useEffect, useRef, useState } from "react";
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
import { Incident } from "@/lib/types";
import { cameras } from "@/lib/dummyData";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [showHeatmap, setShowHeatmap] = useState(false);

  // This would initialize the map library in a real implementation
  useEffect(() => {
    // Map initialization would go here with leaflet or another mapping library
    const initMap = () => {
      if (mapRef.current) {
        console.log("Map would be initialized here");
      }
    };
    
    initMap();
  }, []);

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
              <Select>
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
              <div 
                ref={mapRef}
                className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Interactive map would be rendered here
                </div>
                
                {/* Sample incident markers - these would be placed by the mapping library in reality */}
                {mapIncidents.map((incident) => (
                  <div 
                    key={incident.id}
                    className="absolute w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs cursor-pointer"
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
                    title={incident.location}
                    onClick={() => handleIncidentClick(incident.id)}
                  >
                    <MapPin className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="satellite" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-[600px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400">
                  Satellite view would be rendered here
                </div>
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
