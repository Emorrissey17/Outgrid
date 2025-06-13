import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Star, 
  StarOff, 
  Eye, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Building2, 
  TrendingUp,
  Calendar,
  DollarSign,
  Briefcase,
  Send,
  Filter,
  ArrowUpDown,
  Search,
  Bell,
  User
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Lead } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function RecentLeads() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["/api/leads/paginated", currentPage],
    queryFn: () => api.getLeadsPaginated(currentPage, 20),
  });

  const toggleStarMutation = useMutation({
    mutationFn: ({ leadId, starred }: { leadId: number; starred: boolean }) => 
      api.toggleLeadStar(leadId, starred),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads/paginated"] });
      toast({
        title: "Lead Updated",
        description: "Lead status has been updated successfully.",
      });
    },
  });

  const handleToggleStar = (lead: Lead) => {
    toggleStarMutation.mutate({ leadId: lead.id, starred: !lead.starred });
  };

  const formatEmailContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <span key={index}>
        {paragraph}
        {index < content.split('\n\n').length - 1 && <><br /><br /></>}
      </span>
    ));
  };

  const getMatchScoreBadge = (score?: number) => {
    if (!score) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-300">
          Unknown
        </Badge>
      );
    }
    const variant = score >= 80 ? "default" : score >= 60 ? "secondary" : "outline";
    const className = score >= 80 ? "bg-green-100 text-green-800 border-green-300" :
                     score >= 60 ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                     "bg-gray-100 text-gray-800 border-gray-300";
    
    return (
      <Badge variant={variant} className={className}>
        {score}% match
      </Badge>
    );
  };

  // Filter and sort leads by most recent first
  const filteredAndSortedLeads = (leadsData?.leads || [])
    .filter(lead => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!lead.name.toLowerCase().includes(query) &&
            !lead.company.toLowerCase().includes(query) &&
            !lead.title.toLowerCase().includes(query) &&
            !lead.email.toLowerCase().includes(query) &&
            !(lead.location || "").toLowerCase().includes(query) &&
            !(lead.industry || "").toLowerCase().includes(query)) {
          return false;
        }
      }
      
      // Location filter
      if (locationFilter !== "all") {
        if (!lead.location || !lead.location.toLowerCase().includes(locationFilter.toLowerCase())) {
          return false;
        }
      }
      
      // Industry filter
      if (industryFilter !== "all") {
        if (!lead.industry || !lead.industry.toLowerCase().includes(industryFilter.toLowerCase())) {
          return false;
        }
      }
      
      return true;
    })
    .sort((a, b) => {
      // Always sort by most recent first for this page
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });

  const leads = filteredAndSortedLeads;
  const totalPages = Math.ceil(filteredAndSortedLeads.length / 20) || 1;
  const paginatedLeads = leads.slice((currentPage - 1) * 20, currentPage * 20);

  // Get unique locations and industries for filters
  const allLocations = (leadsData?.leads || []).map(lead => lead.location).filter(Boolean) as string[];
  const allIndustries = (leadsData?.leads || []).map(lead => lead.industry).filter(Boolean) as string[];
  const uniqueLocations = Array.from(new Set(allLocations));
  const uniqueIndustries = Array.from(new Set(allIndustries));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-primary cursor-pointer">SniprAI</h1>
                </Link>
                <div className="flex gap-6">
                  <Link href="/">
                    <Button variant="ghost" className="text-sm">Dashboard</Button>
                  </Link>
                  <Link href="/recent-leads">
                    <Button variant="ghost" className="text-sm bg-blue-50 text-blue-600">Recent Leads</Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5 text-gray-500" />
                </Button>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">SniprAI</h1>
              </Link>
              <div className="flex gap-6">
                <Link href="/">
                  <Button variant="ghost" className="text-sm">Dashboard</Button>
                </Link>
                <Link href="/recent-leads">
                  <Button variant="ghost" className="text-sm bg-blue-50 text-blue-600">Recent Leads</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5 text-gray-500" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div>
                <CardTitle>Recent Leads</CardTitle>
                <p className="text-gray-600 mt-1">Most recent leads with complete details and match analysis</p>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {leads.length} leads
              </Badge>
            </div>
            
            {/* Filtering Controls */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search recent leads..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    {uniqueIndustries.map(industry => (
                      <SelectItem key={industry} value={industry.toLowerCase()}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {paginatedLeads.map((lead) => (
                <div key={lead.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={lead.avatar} alt={lead.name} />
                        <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                          {getMatchScoreBadge(lead.matchScore)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStar(lead)}
                            className="p-1"
                          >
                            {lead.starred ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                        <p className="text-gray-600">{lead.title}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {lead.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.location || "Unknown"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {lead.companySize || "Unknown"}
                          </span>
                          {lead.industry && (
                            <Badge variant="outline" className="text-xs">
                              {lead.industry}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          {selectedLead && (
                            <div>
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={selectedLead.avatar} alt={selectedLead.name} />
                                    <AvatarFallback>{selectedLead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div>{selectedLead.name}</div>
                                    <div className="text-sm font-normal text-gray-600">
                                      {selectedLead.title} at {selectedLead.company}
                                    </div>
                                  </div>
                                  {getMatchScoreBadge(selectedLead.matchScore)}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-4 mt-4">
                                {/* Company Info */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span>{selectedLead.location || "Unknown"}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-gray-400" />
                                    <span>{selectedLead.companySize || "Unknown"}</span>
                                  </div>
                                  {selectedLead.industry && (
                                    <div className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4 text-gray-400" />
                                      <span>{selectedLead.industry}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Match Analysis */}
                                {selectedLead.matchReason && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                      <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                                      <div>
                                        <h4 className="font-medium text-blue-900 text-sm">AI Match Analysis</h4>
                                        <p className="text-blue-700 text-sm mt-1">{selectedLead.matchReason}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Email Content */}
                                {selectedLead.emailContent && (
                                  <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                      <Send className="h-4 w-4" />
                                      Crafted Email
                                    </h4>
                                    <div className="space-y-2">
                                      <div className="font-medium text-sm">Subject: {selectedLead.emailSubject}</div>
                                      <div className="text-gray-700 text-sm leading-relaxed border-t pt-2">
                                        {formatEmailContent(selectedLead.emailContent)}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                {selectedLead.notes && (
                                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                    <h4 className="font-medium text-yellow-900 mb-2">Notes</h4>
                                    <p className="text-yellow-800 text-sm">{selectedLead.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  {/* Quick preview of email content */}
                  {lead.emailContent && (
                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-gray-900 mb-2 text-sm">Email Preview</h4>
                      <div className="text-gray-700 text-sm">
                        <div className="font-medium mb-1">Subject: {lead.emailSubject}</div>
                        <div className="line-clamp-2">{lead.emailContent.substring(0, 150)}...</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Match reason preview */}
                  {lead.matchReason && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 text-sm">AI Match Analysis</h4>
                          <p className="text-blue-700 text-sm mt-1 line-clamp-2">{lead.matchReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages} ({leads.length} leads shown)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}