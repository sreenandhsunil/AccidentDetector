import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SystemStats } from "@/lib/types";

interface SystemStatusProps {
  stats: SystemStats;
}

export default function SystemStatus({ stats }: SystemStatusProps) {
  return (
    <Card className="shadow">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-base font-semibold">System Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>CPU Usage</span>
              <span className="font-medium">{stats.cpu}%</span>
            </div>
            <Progress value={stats.cpu} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Memory Usage</span>
              <span className="font-medium">{stats.memory}%</span>
            </div>
            <Progress value={stats.memory} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Storage</span>
              <span className="font-medium">{stats.storage.used} / {stats.storage.total}</span>
            </div>
            <Progress value={stats.storage.percentage} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Network</span>
              <span className="font-medium">{stats.network}</span>
            </div>
            <Progress value={stats.networkLoad} className="h-2" />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
          <div className="flex justify-between mb-2">
            <span>YOLOv8 Model</span>
            <span className="text-green-500">Active</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Database</span>
            <span className="text-green-500">Connected</span>
          </div>
          <div className="flex justify-between">
            <span>Notification Service</span>
            <span className="text-green-500">Running</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
