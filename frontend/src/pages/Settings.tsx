import { useState } from "react";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import VideoUpload from "@/components/VideoUpload";

export default function Settings() {
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [alertVolume, setAlertVolume] = useState(80);
  const [enableSoundAlerts, setEnableSoundAlerts] = useState(true);
  const [enableEmailNotifications, setEnableEmailNotifications] = useState(true);
  const [preIncidentSeconds, setPreIncidentSeconds] = useState(10);
  const [postIncidentSeconds, setPostIncidentSeconds] = useState(20);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">System Settings</h1>
      
      <Tabs defaultValue="detection">
        <TabsList className="mb-4">
          <TabsTrigger value="detection">Detection Settings</TabsTrigger>
          <TabsTrigger value="alerts">Alert System</TabsTrigger>
          <TabsTrigger value="cameras">Camera Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="backup">Backup & Storage</TabsTrigger>
          <TabsTrigger value="test">Test Videos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detection">
          <Card>
            <CardHeader>
              <CardTitle>Detection Configuration</CardTitle>
              <CardDescription>
                Configure the accident detection parameters and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="confidence-threshold">Detection Confidence Threshold ({confidenceThreshold}%)</Label>
                </div>
                <Slider 
                  id="confidence-threshold"
                  min={50} 
                  max={95} 
                  step={5}
                  value={[confidenceThreshold]}
                  onValueChange={(values) => setConfidenceThreshold(values[0])}
                />
                <p className="text-sm text-muted-foreground">
                  Higher values reduce false positives but may miss some incidents
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model-selection">Detection Model</Label>
                <Select defaultValue="yolov8">
                  <SelectTrigger id="model-selection">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yolov8">YOLOv8 (Default)</SelectItem>
                    <SelectItem value="yolov8s">YOLOv8-Small (Faster)</SelectItem>
                    <SelectItem value="yolov8m">YOLOv8-Medium (Balanced)</SelectItem>
                    <SelectItem value="yolov8l">YOLOv8-Large (Most Accurate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Detection Classes</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="vehicle-collision" defaultChecked />
                    <Label htmlFor="vehicle-collision">Vehicle Collision</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="pedestrian-incident" defaultChecked />
                    <Label htmlFor="pedestrian-incident">Pedestrian Incidents</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="near-miss" defaultChecked />
                    <Label htmlFor="near-miss">Near Misses</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="debris" defaultChecked />
                    <Label htmlFor="debris">Road Debris</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fps-limit">Processing Frame Rate</Label>
                <Select defaultValue="15">
                  <SelectTrigger id="fps-limit">
                    <SelectValue placeholder="Select FPS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 FPS (Low CPU)</SelectItem>
                    <SelectItem value="10">10 FPS (Balanced)</SelectItem>
                    <SelectItem value="15">15 FPS (Recommended)</SelectItem>
                    <SelectItem value="30">30 FPS (High CPU)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Detection Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>
                Configure how alerts are triggered and displayed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-alerts">Sound Alerts</Label>
                  <Switch 
                    id="sound-alerts" 
                    checked={enableSoundAlerts}
                    onCheckedChange={setEnableSoundAlerts}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Play audio alerts when incidents are detected
                </p>
              </div>
              
              {enableSoundAlerts && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="alert-volume">Alert Volume ({alertVolume}%)</Label>
                  </div>
                  <Slider 
                    id="alert-volume"
                    min={0} 
                    max={100} 
                    step={5}
                    value={[alertVolume]}
                    onValueChange={(values) => setAlertVolume(values[0])}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts">Email Notifications</Label>
                  <Switch 
                    id="email-alerts" 
                    checked={enableEmailNotifications}
                    onCheckedChange={setEnableEmailNotifications}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for detected incidents
                </p>
              </div>
              
              {enableEmailNotifications && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-recipients">Email Recipients</Label>
                    <Input 
                      id="email-recipients"
                      placeholder="Enter comma-separated email addresses"
                      defaultValue="admin@example.com, security@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-severity">Notification Severity Threshold</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="email-severity">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Incidents</SelectItem>
                        <SelectItem value="high">High Severity Only</SelectItem>
                        <SelectItem value="medium">Medium and High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="alert-timeout">Alert Banner Duration (seconds)</Label>
                <Select defaultValue="30">
                  <SelectTrigger id="alert-timeout">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="0">Until dismissed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Alert Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="cameras">
          <Card>
            <CardHeader>
              <CardTitle>Camera Management</CardTitle>
              <CardDescription>
                Add, remove, and configure camera streams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between">
                <Button variant="outline">Add Camera</Button>
                <Button variant="outline">Scan Network</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Camera 1</TableCell>
                    <TableCell>Highway Junction</TableCell>
                    <TableCell>IP Camera</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Online
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>Camera 2</TableCell>
                    <TableCell>Parking Lot North</TableCell>
                    <TableCell>IP Camera</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Online
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell>Camera 3</TableCell>
                    <TableCell>Main Intersection</TableCell>
                    <TableCell>USB Camera</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Online
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and access permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button>Add User</Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>admin</TableCell>
                    <TableCell>Admin User</TableCell>
                    <TableCell>Administrator</TableCell>
                    <TableCell>Today, 09:15 AM</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Reset Password</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>operator1</TableCell>
                    <TableCell>John Smith</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Yesterday, 4:30 PM</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Reset Password</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>viewer1</TableCell>
                    <TableCell>Jane Doe</TableCell>
                    <TableCell>Viewer</TableCell>
                    <TableCell>3 days ago</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">Edit</Button>
                        <Button variant="ghost" size="sm">Reset Password</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Video Storage Settings</CardTitle>
              <CardDescription>
                Configure video recording and storage settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Incident Auto-Save</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pre-incident">Pre-incident buffer (seconds)</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="pre-incident"
                        min={0} 
                        max={30} 
                        step={1}
                        value={[preIncidentSeconds]}
                        onValueChange={(values) => setPreIncidentSeconds(values[0])}
                      />
                      <span className="w-12 text-right">{preIncidentSeconds}s</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-incident">Post-incident buffer (seconds)</Label>
                    <div className="flex items-center space-x-2">
                      <Slider 
                        id="post-incident"
                        min={0} 
                        max={60} 
                        step={5}
                        value={[postIncidentSeconds]}
                        onValueChange={(values) => setPostIncidentSeconds(values[0])}
                      />
                      <span className="w-12 text-right">{postIncidentSeconds}s</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storage-path">Storage Location</Label>
                <Input 
                  id="storage-path"
                  defaultValue="/data/incidents"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger id="retention">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="0">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compression">Video Compression</Label>
                <Select defaultValue="h264">
                  <SelectTrigger id="compression">
                    <SelectValue placeholder="Select compression" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h264">H.264 (Balanced)</SelectItem>
                    <SelectItem value="h265">H.265 (Efficient)</SelectItem>
                    <SelectItem value="vp9">VP9 (High Quality)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-backup">Automatic Backup</Label>
                  <Switch id="auto-backup" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enable automatic backup of incident data to external storage
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Storage Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="test">
          <VideoUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}
