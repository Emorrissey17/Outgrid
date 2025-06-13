import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Check, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export function WorkflowSection() {
  const [icp, setIcp] = useState("");
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: 1, title: "Company Discovery", description: "AI Scraping", completed: false, active: false },
    { id: 2, title: "Data Enrichment", description: "Contacts Added", completed: false, active: false },
    { id: 3, title: "Email Generation", description: "Messages Created", completed: false, active: false },
    { id: 4, title: "Ready to Send", description: "Review & Send", completed: false, active: false },
  ]);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const createCampaignMutation = useMutation({
    mutationFn: (icp: string) => api.createCampaign(icp),
    onMutate: () => {
      // Start workflow animation
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        completed: false,
        active: index === 0
      })));
    },
    onSuccess: async (data) => {
      // Complete all steps
      setSteps(prev => prev.map(step => ({
        ...step,
        completed: true,
        active: false
      })));
      
      // Force refresh queries to show new data
      await queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      
      // Also refetch immediately to ensure data is fresh
      await queryClient.refetchQueries({ queryKey: ["/api/stats"] });
      await queryClient.refetchQueries({ queryKey: ["/api/leads"] });
      
      console.log("Campaign created with leads:", data.leads?.length || 0);
      
      toast({
        title: "Campaign Created Successfully",
        description: `Generated ${data.leads?.length || 0} leads with email drafts. Review and send emails.`,
      });
      
      // Redirect to email review page
      setTimeout(() => {
        setLocation("/email-review");
      }, 1500);
    },
    onError: (error) => {
      // Reset steps on error
      setSteps(prev => prev.map(step => ({
        ...step,
        completed: false,
        active: false
      })));
      
      toast({
        title: "Campaign Creation Failed",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Simulate step progression
  const simulateSteps = () => {
    const intervals: NodeJS.Timeout[] = [];
    
    steps.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          completed: i < index,
          active: i === index
        })));
      }, index * 1500);
      intervals.push(timeout);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  };

  const handleStartCampaign = () => {
    if (!icp.trim()) {
      toast({
        title: "ICP Required",
        description: "Please enter your Ideal Customer Profile.",
        variant: "destructive",
      });
      return;
    }

    simulateSteps();
    createCampaignMutation.mutate(icp);
  };

  const getStepIcon = (step: WorkflowStep) => {
    if (step.completed) {
      return <Check className="h-4 w-4 text-white" />;
    }
    if (step.active && createCampaignMutation.isPending) {
      return <Loader2 className="h-4 w-4 text-white animate-spin" />;
    }
    return <div className="w-4 h-4" />;
  };

  const getStepStyles = (step: WorkflowStep) => {
    if (step.completed) {
      return "bg-green-500 border-green-200 text-green-800";
    }
    if (step.active && createCampaignMutation.isPending) {
      return "bg-blue-500 border-blue-200 text-blue-800";
    }
    return "bg-gray-100 border-gray-200 text-gray-600";
  };

  return (
    <Card className="mb-8">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Create New Campaign</h2>
        <p className="text-gray-600 mt-1">Define your Ideal Customer Profile and let AI handle the rest</p>
      </div>
      
      <CardContent className="p-6">
        <div className="mb-6">
          <Label htmlFor="icp-input" className="block text-sm font-medium text-gray-700 mb-2">
            Ideal Customer Profile
          </Label>
          <div className="flex space-x-4">
            <Input
              id="icp-input"
              type="text"
              placeholder="e.g., marketing agencies in Austin with 10-50 employees"
              value={icp}
              onChange={(e) => setIcp(e.target.value)}
              className="flex-1"
              disabled={createCampaignMutation.isPending}
            />
            <Button 
              onClick={handleStartCampaign}
              disabled={createCampaignMutation.isPending}
              className="px-6"
            >
              {createCampaignMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Start Campaign
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                step.completed ? "bg-green-50" : step.active ? "bg-blue-50" : "bg-gray-50"
              } ${getStepStyles(step)}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                step.completed ? "bg-green-500" : step.active ? "bg-blue-500" : "bg-gray-300"
              }`}>
                {getStepIcon(step)}
              </div>
              <div>
                <p className={`font-medium ${
                  step.completed ? "text-green-800" : step.active ? "text-blue-800" : "text-gray-600"
                }`}>
                  {step.title}
                </p>
                <p className={`text-sm ${
                  step.completed ? "text-green-600" : step.active ? "text-blue-600" : "text-gray-500"
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
