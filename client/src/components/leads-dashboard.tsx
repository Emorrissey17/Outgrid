import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, Edit, ExternalLink, Filter, Check, Loader2, X, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Lead } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function LeadsDashboard() {
  const [sendingLeads, setSendingLeads] = useState<Set<number>>(new Set());
  const [showFilter, setShowFilter] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: leads, isLoading } = useQuery({
    queryKey: ["/api/leads"],
    queryFn: () => api.getLeads(),
  });

  const sendEmailMutation = useMutation({
    mutationFn: (leadId: number) => api.sendEmail(leadId),
    onMutate: (leadId) => {
      setSendingLeads(prev => new Set(prev).add(leadId));
    },
    onSuccess: (_, leadId) => {
      setSendingLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
      });
    },
    onError: (_, leadId) => {
      setSendingLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
      
      toast({
        title: "Send Failed",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Filter leads based on search query
  const filteredLeads = leads?.filter(lead => {
    if (!filterQuery.trim()) return true;
    
    const query = filterQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.title.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query)
    );
  }) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Sent</Badge>;
      case "ready":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Ready to Send</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatEmailContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <span key={index}>
        {paragraph}
        {index < content.split('\n\n').length - 1 && <><br /><br /></>}
      </span>
    ));
  };

  const handleClearFilter = () => {
    setFilterQuery("");
    setShowFilter(false);
  };

  if (isLoading) {
    return (
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generated Leads</h2>
          <p className="text-gray-600 mt-1">Review AI-generated outreach messages</p>
        </div>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-40 h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generated Leads</h2>
          <p className="text-gray-600 mt-1">Review AI-generated outreach messages</p>
        </div>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
            <p className="text-gray-600">Create your first campaign to generate leads</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generated Leads</h2>
            <p className="text-gray-600 mt-1">Review AI-generated outreach messages</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
              className={showFilter ? "bg-blue-50 border-blue-300" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Send className="h-4 w-4 mr-2" />
              Send All
            </Button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search by name, title, company, or email..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {filterQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {filteredLeads.length} of {leads?.length || 0} leads
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-6 space-y-6">
        {filteredLeads.length === 0 && leads && leads.length > 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads match your filter</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search terms</p>
            <Button variant="outline" onClick={handleClearFilter}>
              Clear Filter
            </Button>
          </div>
        ) : (
          filteredLeads.map((lead: Lead) => (
            <div key={lead.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={lead.avatar} alt={lead.name} />
                  <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                  <p className="text-gray-600">{lead.title}</p>
                  <p className="text-sm text-gray-500">{lead.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(lead.status)}
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {lead.emailContent && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Generated Email:</h4>
                <div className="text-gray-700 text-sm leading-relaxed">
                  {formatEmailContent(lead.emailContent)}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Send className="h-4 w-4 mr-1" />
                  {lead.email}
                </span>
                {lead.linkedinUrl && (
                  <span className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    {lead.linkedinUrl}
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                {lead.status === "sent" ? (
                  <Button size="sm" className="bg-green-600 cursor-not-allowed opacity-50" disabled>
                    <Check className="h-4 w-4 mr-2" />
                    Sent
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => sendEmailMutation.mutate(lead.id)}
                    disabled={sendingLeads.has(lead.id)}
                  >
                    {sendingLeads.has(lead.id) ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {sendingLeads.has(lead.id) ? "Sending..." : "Send"}
                  </Button>
                )}
              </div>
            </div>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
