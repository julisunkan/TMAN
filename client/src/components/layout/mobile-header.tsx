import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Menu, Shield } from "lucide-react";
import SearchOverlay from "./search-overlay";

export default function MobileHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[hsl(227,39%,23%)]/95 backdrop-blur-lg border-b border-[hsl(120,100%,50%)]/20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[hsl(120,100%,50%)] to-[hsl(105,100%,55%)] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-[hsl(240,10%,6%)]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">CyberLabs</h1>
              <p className="text-xs text-[hsl(215,16%,47%)]">Academy</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-2 rounded-lg bg-[hsl(240,10%,6%)]/50 hover:bg-[hsl(240,10%,6%)] transition-colors"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-4 h-4 text-[hsl(207,90%,54%)]" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="p-2 rounded-lg bg-[hsl(240,10%,6%)]/50 hover:bg-[hsl(240,10%,6%)] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-4 h-4 text-[hsl(120,100%,50%)]" />
            </Button>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
