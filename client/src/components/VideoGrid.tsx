import { useState } from "react";
import VideoFeed from "./VideoFeed";
import { Camera } from "@/lib/types";
import IncidentModal from "./IncidentModal";

interface VideoGridProps {
  cameras: Camera[];
}

export default function VideoGrid({ cameras }: VideoGridProps) {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFullscreen = (cameraId: string) => {
    setSelectedCamera(cameraId);
    setShowModal(true);
  };

  const handleSettings = (cameraId: string) => {
    console.log(`Opening settings for camera ${cameraId}`);
    // Would open camera settings in a real implementation
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCamera(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cameras.map((camera) => (
          <VideoFeed
            key={camera.id}
            camera={camera}
            onFullscreen={handleFullscreen}
            onSettings={handleSettings}
          />
        ))}
      </div>

      {/* Incident modal for detailed view */}
      {showModal && selectedCamera && (
        <IncidentModal
          camera={cameras.find(c => c.id === selectedCamera)!}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
