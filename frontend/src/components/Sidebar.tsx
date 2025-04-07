import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

// Icons
import {
  LayoutDashboard,
  File,
  MapPin,
  BarChartBig,
  Settings,
  CheckCircle,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: File, label: "Incident Log", href: "/incidents" },
  { icon: MapPin, label: "Map View", href: "/map" },
  { icon: BarChartBig, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 flex items-center">
        <CheckCircle className="w-8 h-8 text-primary" />
        <h1 className="ml-2 text-lg font-semibold">Accident Detection</h1>
      </div>
      <nav className="mt-6 flex flex-col flex-1">
        {navItems.map((item) => {
          const isActive = item.href === location || 
            (item.href !== "/" && location.startsWith(item.href));
          
          return (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                  isActive && "bg-primary/10 text-primary dark:text-primary border-l-4 border-primary"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-medium">AU</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
