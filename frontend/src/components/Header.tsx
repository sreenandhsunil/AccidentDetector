import { useState } from "react";
import { Bell, AlertTriangle, Menu } from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import { Switch } from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // This would be connected to actual state in a real implementation
  const activeIncidents = 2;

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 ml-auto">
        {/* Active incidents badge */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                {activeIncidents > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs"
                    variant="destructive"
                  >
                    {activeIncidents}
                  </Badge>
                )}
                <AlertTriangle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Active incidents</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Notifications */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Dark mode toggle */}
        <div className="flex items-center">
          <span className="mr-2 text-sm hidden sm:block">Theme</span>
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
        </div>
      </div>
    </header>
  );
}
