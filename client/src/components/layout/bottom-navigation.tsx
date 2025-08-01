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

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[hsl(227,39%,23%)]/95 backdrop-blur-lg border-t border-[hsl(120,100%,50%)]/20 px-4 py-2 z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant="ghost"
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                  active 
                    ? "bg-[hsl(120,100%,50%)]/20 text-[hsl(120,100%,50%)]" 
                    : "text-[hsl(215,16%,47%)] hover:bg-[hsl(240,10%,6%)]/50"
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
                
                {item.badge && item.badge > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-[hsl(14,100%,60%)] text-[hsl(240,10%,6%)] text-xs font-bold"
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
