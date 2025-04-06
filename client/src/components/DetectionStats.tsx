import { useState } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatPeriod, IncidentStat } from "@/lib/types";

interface DetectionStatsProps {
  stats: IncidentStat[];
}

export default function DetectionStats({ stats }: DetectionStatsProps) {
  const [period, setPeriod] = useState<StatPeriod>("today");
  
  // Filter stats based on selected period
  const filteredStats = stats.filter(stat => stat.period === period);
  
  return (
    <Card className="shadow lg:col-span-2">
      <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Detection Statistics</CardTitle>
        <div className="flex space-x-2">
          <Select 
            value={period} 
            onValueChange={(value) => setPeriod(value as StatPeriod)}
          >
            <SelectTrigger className="w-[130px] h-8 text-sm">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded overflow-hidden mb-4 flex items-center justify-center">
          {/* Chart implementation would go here */}
          <div className="text-gray-500 dark:text-gray-400">
            Incident frequency chart would be rendered here
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          {filteredStats.map((stat, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase">{stat.label}</h3>
              <p className="text-xl font-semibold mt-1">{stat.count}</p>
              <p className={`text-xs mt-1 ${
                stat.trend > 0 
                  ? 'text-red-500' 
                  : stat.trend < 0 
                    ? 'text-green-500' 
                    : 'text-amber-500'
              }`}>
                {stat.trend > 0 
                  ? `+${stat.trend} from previous` 
                  : stat.trend < 0 
                    ? `${stat.trend} from previous` 
                    : 'Same as previous'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
