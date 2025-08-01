import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Tutorial from "@/pages/tutorial";
import Modules from "@/pages/modules";
import Tools from "@/pages/tools";
import Achievements from "@/pages/achievements";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/modules" component={Modules} />
      <Route path="/tutorial/:moduleId" component={Tutorial} />
      <Route path="/tutorial/:moduleId/:lessonId" component={Tutorial} />
      <Route path="/tools" component={Tools} />
      <Route path="/achievements" component={Achievements} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-cyber-dark text-white">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
