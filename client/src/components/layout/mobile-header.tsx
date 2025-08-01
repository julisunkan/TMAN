import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu, Shield } from "lucide-react";
import SearchOverlay from "./search-overlay";

export default function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-blue-200 shadow-lg shadow-blue-100/50">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CyberLabs</h1>
              <p className="text-sm text-gray-600 font-medium">Security Academy</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-200 shadow-sm"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5 text-blue-600" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-3 rounded-xl bg-yellow-50 hover:bg-yellow-100 transition-all duration-200 shadow-sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5 text-yellow-600" />
            </Button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
