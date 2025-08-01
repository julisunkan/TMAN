import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  BookOpen, 
  Settings, 
  Trophy 
} from "lucide-react";

interface NavItem {
  path: string;
  icon: typeof Home;
  label: string;
  badge?: number;
}

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/modules", icon: BookOpen, label: "Modules" },
    { path: "/tools", icon: Settings, label: "Tools" },
    { path: "/achievements", icon: Trophy, label: "Achievements", badge: 1 }
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  const getNavColors = (path: string, active: boolean) => {
    const baseColors = {
      "/": active ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-blue-50 hover:text-blue-600",
      "/modules": active ? "bg-yellow-100 text-yellow-700" : "text-gray-500 hover:bg-yellow-50 hover:text-yellow-600",
      "/tools": active ? "bg-red-100 text-red-600" : "text-gray-500 hover:bg-red-50 hover:text-red-600",
      "/achievements": active ? "bg-purple-100 text-purple-600" : "text-gray-500 hover:bg-purple-50 hover:text-purple-600"
    };
    return baseColors[path as keyof typeof baseColors] || "text-gray-500";
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-2 py-2 z-40 shadow-lg shadow-gray-100">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-200 relative min-w-[60px] ${getNavColors(item.path, active)}`}
              >
                <IconComponent className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">{item.label}</span>
                
                {item.badge && item.badge > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs font-bold border-2 border-white"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
