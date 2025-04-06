import { useState } from "react";
import AlertBanner from "@/components/AlertBanner";
import VideoGrid from "@/components/VideoGrid";
import RecentIncidents from "@/components/RecentIncidents";
import LocationMap from "@/components/LocationMap";
import SystemStatus from "@/components/SystemStatus";
import DetectionStats from "@/components/DetectionStats";
import IncidentModal from "@/components/IncidentModal";
import { 
  cameras, 
  incidents, 
  mapIncidents, 
  systemStats, 
  incidentStats 
} from "@/lib/dummyData";
import { Incident } from "@/lib/types";

export default function Dashboard() {
  const [showAlert, setShowAlert] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowIncidentModal(true);
  };

  const handleDownloadClip = (incident: Incident) => {
    console.log(`Downloading clip for incident ${incident.id}`);
    // This would trigger a download in a real implementation
  };

  const handleAlertView = () => {
    // Find the latest incident
    const latestIncident = incidents[0];
    handleViewIncident(latestIncident);
  };

  const handleCloseModal = () => {
    setShowIncidentModal(false);
    setSelectedIncident(null);
  };

  return (
    <div>
      {/* Alert Banner */}
      {showAlert && (
        <AlertBanner
          title="Critical Accident Detected"
          description="Vehicle collision on Camera 1 - Highway Junction - 2 minutes ago"
          onView={handleAlertView}
          onDismiss={() => setShowAlert(false)}
        />
      )}

      {/* Dashboard Title */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Live Monitoring Dashboard</h1>
        <div className="flex items-center text-sm">
          <span className="flex items-center text-green-500 mr-4">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            System Active
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            Last update: <span>1 minute ago</span>
          </span>
        </div>
      </div>

      {/* Video Grid */}
      <VideoGrid cameras={cameras} />

      {/* Two-column layout for incidents and map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <RecentIncidents 
          incidents={incidents} 
          onViewIncident={handleViewIncident} 
          onDownloadClip={handleDownloadClip} 
        />
        <LocationMap incidents={mapIncidents} />
      </div>

      {/* Two-column layout for system status and detection stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SystemStatus stats={systemStats} />
        <DetectionStats stats={incidentStats} />
      </div>

      {/* Incident Modal */}
      {showIncidentModal && selectedIncident && (
        <IncidentModal
          camera={cameras.find(c => c.id === selectedIncident.cameraId)!}
          incident={selectedIncident}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
