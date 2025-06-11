import { StatsBar } from "@/components/stats-bar";
import { WorkflowSection } from "@/components/workflow-section";
import { LeadsDashboard } from "@/components/leads-dashboard";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">SniprAI</h1>
              <span className="ml-2 text-sm text-gray-500">AI-Powered Outbound Automation</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
              <Avatar className="w-8 h-8 bg-primary">
                <AvatarFallback className="text-white text-sm font-medium">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsBar />
        <WorkflowSection />
        <LeadsDashboard />
      </div>
    </div>
  );
}
