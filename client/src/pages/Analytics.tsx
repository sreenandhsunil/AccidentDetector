import { useState } from "react";
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
import { Calendar, BarChart3, LineChart, PieChart, Eye, Download } from "lucide-react";
import { incidentStats } from "@/lib/dummyData";

export default function Analytics() {
  const [timePeriod, setTimePeriod] = useState("month");
  const [exportFormat, setExportFormat] = useState("pdf");

  // Filter stats based on selected time period
  const filteredStats = incidentStats.filter(stat => stat.period === timePeriod);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Analytics & Reporting</h1>
      
      <Card className="mb-4">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
            <div className="flex space-x-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {filteredStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                  <div className="text-3xl font-bold mt-2">{stat.count}</div>
                  <div className={`text-sm mt-2 ${
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Tabs defaultValue="incidents">
            <TabsList className="mb-4">
              <TabsTrigger value="incidents">Incident Frequency</TabsTrigger>
              <TabsTrigger value="severity">Severity Distribution</TabsTrigger>
              <TabsTrigger value="type">Incident Types</TabsTrigger>
              <TabsTrigger value="location">Location Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="incidents" className="mt-0">
              <Card>
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base">Incident Frequency Over Time</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <LineChart className="h-16 w-16 text-muted-foreground opacity-50" />
                    <span className="ml-4 text-muted-foreground">Line chart would be rendered here</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="severity" className="mt-0">
              <Card>
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base">Incident Severity Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <PieChart className="h-16 w-16 text-muted-foreground opacity-50" />
                    <span className="ml-4 text-muted-foreground">Pie chart would be rendered here</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="type" className="mt-0">
              <Card>
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base">Incident Types Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <BarChart3 className="h-16 w-16 text-muted-foreground opacity-50" />
                    <span className="ml-4 text-muted-foreground">Bar chart would be rendered here</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="location" className="mt-0">
              <Card>
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-base">Incidents by Location</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                    <div className="text-muted-foreground">
                      Heatmap would be rendered here
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Generated Reports</CardTitle>
            <div className="flex space-x-2">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Format</SelectItem>
                  <SelectItem value="excel">Excel Format</SelectItem>
                  <SelectItem value="csv">CSV Format</SelectItem>
                </SelectContent>
              </Select>
              <button className="px-3 py-2 bg-primary text-white rounded hover:bg-primary/90">
                Export Report
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center">
              <div>
                <h3 className="font-medium">Daily Incident Summary</h3>
                <p className="text-sm text-muted-foreground">Generated today at 08:00 AM</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center">
              <div>
                <h3 className="font-medium">Weekly Incident Analysis</h3>
                <p className="text-sm text-muted-foreground">Generated yesterday at 11:30 PM</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center">
              <div>
                <h3 className="font-medium">Monthly Comprehensive Report</h3>
                <p className="text-sm text-muted-foreground">Generated May 1, 2023</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
