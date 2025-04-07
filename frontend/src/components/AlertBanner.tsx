import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertBannerProps {
  title: string;
  description: string;
  onView: () => void;
  onDismiss: () => void;
}

export default function AlertBanner({ 
  title, 
  description, 
  onView, 
  onDismiss 
}: AlertBannerProps) {
  return (
    <Alert 
      variant="destructive" 
      className="mb-4 flex items-center justify-between incident-animation"
    >
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white bg-white/20 hover:bg-white/30 border-none"
          onClick={onView}
        >
          View
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-white bg-white/20 hover:bg-white/30 border-none"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </Alert>
  );
}
