import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { api, Lead } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send, Mail, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmailReview() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());
  const [editedEmails, setEditedEmails] = useState<Record<number, { subject: string; content: string }>>({});

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
    enabled: true,
  });

  const leadsWithEmails = useMemo(() => 
    leads.filter((lead) => lead.emailContent && lead.emailSubject), 
    [leads]
  );

  // Initialize edited emails when leads are first loaded
  useEffect(() => {
    if (leadsWithEmails.length === 0) return;
    
    // Only initialize if we don't have any edited emails yet
    const hasAnyEditedEmails = Object.keys(editedEmails).length > 0;
    if (hasAnyEditedEmails) return;
    
    const initialEmails: Record<number, { subject: string; content: string }> = {};
    leadsWithEmails.forEach((lead) => {
      initialEmails[lead.id] = {
        subject: lead.emailSubject || "",
        content: lead.emailContent || "",
      };
    });
    
    setEditedEmails(initialEmails);
  }, [leadsWithEmails.length]); // Only depend on the length, not the array itself

  const updateLeadMutation = useMutation({
    mutationFn: ({ leadId, data }: { leadId: number; data: { emailSubject?: string; emailContent?: string } }) =>
      api.updateLead(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    },
  });

  const sendSelectedEmailsMutation = useMutation({
    mutationFn: (leadIds: number[]) => api.sendSelectedEmails(leadIds),
    onSuccess: (data) => {
      toast({
        title: "Emails sent successfully",
        description: `${data.sent} emails have been sent.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setLocation("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error sending emails",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSelectLead = (leadId: number, checked: boolean) => {
    const newSelected = new Set(selectedLeads);
    if (checked) {
      newSelected.add(leadId);
    } else {
      newSelected.delete(leadId);
    }
    setSelectedLeads(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(leadsWithEmails.map((lead) => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleEmailEdit = (leadId: number, field: 'subject' | 'content', value: string) => {
    setEditedEmails(prev => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [field]: value,
      },
    }));
  };

  const handleSaveEmail = (leadId: number) => {
    const emailData = editedEmails[leadId];
    if (emailData) {
      updateLeadMutation.mutate({
        leadId,
        data: {
          emailSubject: emailData.subject,
          emailContent: emailData.content,
        },
      });
    }
  };

  const handleSendSelected = () => {
    if (selectedLeads.size === 0) {
      toast({
        title: "No leads selected",
        description: "Please select at least one lead to send emails.",
        variant: "destructive",
      });
      return;
    }

    // Save all edited emails before sending
    const savePromises = Array.from(selectedLeads).map(leadId => {
      const emailData = editedEmails[leadId];
      if (emailData) {
        return updateLeadMutation.mutateAsync({
          leadId,
          data: {
            emailSubject: emailData.subject,
            emailContent: emailData.content,
          },
        });
      }
      return Promise.resolve();
    });

    Promise.all(savePromises).then(() => {
      sendSelectedEmailsMutation.mutate(Array.from(selectedLeads));
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading email drafts...</div>
      </div>
    );
  }

  if (leadsWithEmails.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center p-12">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No email drafts found</h3>
              <p className="text-muted-foreground">Generate emails from a campaign first.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Review Email Drafts</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all"
              checked={selectedLeads.size === leadsWithEmails.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all">Select All ({leadsWithEmails.length})</Label>
          </div>
          
          <Button
            onClick={handleSendSelected}
            disabled={selectedLeads.size === 0 || sendSelectedEmailsMutation.isPending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Send Selected ({selectedLeads.size})
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {leadsWithEmails.map((lead) => (
          <Card key={lead.id} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedLeads.has(lead.id)}
                    onCheckedChange={(checked) => handleSelectLead(lead.id, checked as boolean)}
                  />
                  <div className="flex items-center gap-3">
                    {lead.avatar && (
                      <img
                        src={lead.avatar}
                        alt={lead.name}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {lead.name}
                      </CardTitle>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span>{lead.title}</span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {lead.company}
                        </span>
                        <span>{lead.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSaveEmail(lead.id)}
                  disabled={updateLeadMutation.isPending}
                >
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`subject-${lead.id}`}>Email Subject</Label>
                <Input
                  id={`subject-${lead.id}`}
                  value={editedEmails[lead.id]?.subject || ""}
                  onChange={(e) => handleEmailEdit(lead.id, 'subject', e.target.value)}
                  placeholder="Email subject..."
                />
              </div>
              
              <div>
                <Label htmlFor={`content-${lead.id}`}>Email Content</Label>
                <Textarea
                  id={`content-${lead.id}`}
                  value={editedEmails[lead.id]?.content || ""}
                  onChange={(e) => handleEmailEdit(lead.id, 'content', e.target.value)}
                  placeholder="Email content..."
                  rows={6}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}