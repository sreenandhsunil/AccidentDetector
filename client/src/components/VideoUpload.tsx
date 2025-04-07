import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UploadedVideo {
  filename: string;
  originalname: string;
  path: string;
  size: number;
  mimetype: string;
}

interface VideoListItem {
  filename: string;
  path: string;
}

export default function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query to fetch the list of uploaded videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['/api/videos'],
    queryFn: async () => {
      const response = await fetch('/api/videos');
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      return response.json() as Promise<VideoListItem[]>;
    }
  });
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  // Upload the video
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append("video", file);
    
    try {
      // Create a simulated progress indicator
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
      
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      
      if (!response.ok) {
        throw new Error('Failed to upload video');
      }
      
      setUploadProgress(100);
      
      const data = await response.json();
      
      toast({
        title: "Upload Complete",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      // Reset the file input and invalidate the videos query
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Handle testing a video with the AI model
  const processVideoMutation = useMutation({
    mutationFn: async (filename: string) => {
      const response = await fetch(`/api/process-video/${filename}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to process video');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Processing Complete",
        description: `Video processed successfully. ${data.incidentsDetected ? `${data.incidentsDetected} incidents detected.` : 'No incidents detected.'}`,
      });
      // Invalidate relevant queries after processing is complete
      queryClient.invalidateQueries({ queryKey: ['/api/incidents'] });
    },
    onError: (error) => {
      console.error('Error processing video:', error);
      toast({
        title: "Processing Failed",
        description: "There was an error processing your video. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleTestVideo = (filename: string) => {
    toast({
      title: "Processing Video",
      description: "The video is being processed by the accident detection model. This may take a moment.",
    });
    
    processVideoMutation.mutate(filename);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Test Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              disabled={uploading}
            />
            
            {file && (
              <div className="text-sm">
                <p>Selected file: {file.name}</p>
                <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}
            
            {uploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-center">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="w-full"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Videos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading videos...</p>
          ) : videos.length === 0 ? (
            <p className="text-muted-foreground">No videos uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.filename} className="flex items-center justify-between border-b pb-2">
                  <div className="flex-1">
                    <p className="font-medium">{video.filename}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(video.path, '_blank')}
                    >
                      View
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleTestVideo(video.filename)}
                      disabled={processVideoMutation.isPending}
                    >
                      {processVideoMutation.isPending ? "Processing..." : "Test with AI"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}