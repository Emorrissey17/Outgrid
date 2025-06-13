import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  StickyNote,
  Send,
  Filter,
  ArrowUpDown,
  Search
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type Lead } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface LeadsTableProps {
  className?: string;
}

export function LeadsTable({ className }: LeadsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: leadsData, isLoading } = useQuery({
    queryKey: ["/api/leads/paginated", currentPage],
    queryFn: () => api.getLeadsPaginated(currentPage, 20),
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ leadId, notes }: { leadId: number; notes: string }) => 
      api.updateLeadNotes(leadId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads/paginated"] });
      setEditingNotes(null);
      toast({
        title: "Notes Updated",
        description: "Lead notes have been saved successfully.",
      });
    },
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

  const handleEditNotes = (lead: Lead) => {
    setEditingNotes(lead.id);
    setNoteValue(lead.notes || "");
  };

  const handleSaveNotes = (leadId: number) => {
    updateNotesMutation.mutate({ leadId, notes: noteValue });
  };

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

  // Filter and sort leads
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
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "matchScore":
          aValue = a.matchScore || 0;
          bValue = b.matchScore || 0;
          break;
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "company":
          aValue = a.company;
          bValue = b.company;
          break;
        case "location":
          aValue = a.location || "Unknown";
          bValue = b.location || "Unknown";
          break;
        case "companySize":
          aValue = parseInt((a.companySize || "0").replace(/\D/g, "")) || 0;
          bValue = parseInt((b.companySize || "0").replace(/\D/g, "")) || 0;
          break;
        default:
          aValue = a.matchScore || 0;
          bValue = b.matchScore || 0;
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
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
      <Card className={className}>
        <CardHeader>
          <CardTitle>Leads Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Leads Management ({leads.length} filtered / {leadsData?.total || 0} total)</CardTitle>
          <div className="flex gap-2">
            <Dialog open={showAllEmails} onOpenChange={setShowAllEmails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  View All Emails
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>All Crafted Emails ({leads.length} leads)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {leads.filter(lead => lead.emailContent).map((lead) => (
                    <div key={lead.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={lead.avatar} alt={lead.name} />
                          <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{lead.name}</h4>
                          <p className="text-sm text-gray-600">{lead.title} at {lead.company}</p>
                        </div>
                        {getMatchScoreBadge(lead.matchScore)}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h5 className="font-medium mb-2">Subject: {lead.emailSubject}</h5>
                        <div className="text-sm text-gray-700 leading-relaxed">
                          {lead.emailContent && formatEmailContent(lead.emailContent)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Filtering and Search Controls */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
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
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="matchScore">Match Score</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="companySize">Company Size</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Match</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStar(lead)}
                    >
                      {lead.starred ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={lead.avatar} alt={lead.name} />
                        <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-600">{lead.title}</div>
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">{lead.company}</span>
                    </div>
                    {lead.industry && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {lead.industry}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{lead.location || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{lead.companySize || "Unknown"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getMatchScoreBadge(lead.matchScore)}
                  </TableCell>
                  <TableCell>
                    {editingNotes === lead.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteValue}
                          onChange={(e) => setNoteValue(e.target.value)}
                          placeholder="Add notes..."
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveNotes(lead.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {lead.notes && (
                          <p className="text-sm text-gray-700 max-w-xs truncate">{lead.notes}</p>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNotes(lead)}
                          className="text-xs"
                        >
                          <StickyNote className="h-3 w-3 mr-1" />
                          {lead.notes ? "Edit" : "Add Note"}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
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
                                  {selectedLead.location && (
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-400" />
                                      <span>{selectedLead.location}</span>
                                    </div>
                                  )}
                                  {selectedLead.companySize && (
                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4 text-gray-400" />
                                      <span>{selectedLead.companySize}</span>
                                    </div>
                                  )}
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

                                {/* Research Details */}
                                {selectedLead.detailsResearched && (
                                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-green-900 flex items-center gap-2 mb-3">
                                      <Briefcase className="h-4 w-4" />
                                      Detailed Company Research
                                    </h4>
                                    
                                    <div className="space-y-3 text-sm">
                                      {selectedLead.companyDescription && (
                                        <div className="bg-white rounded-lg p-3 border border-green-100">
                                          <p className="text-green-800 leading-relaxed">{selectedLead.companyDescription}</p>
                                        </div>
                                      )}
                                      
                                      <div className="grid grid-cols-2 gap-3">
                                        {selectedLead.foundingYear && (
                                          <div className="flex items-center gap-2 text-gray-700">
                                            <Calendar className="h-4 w-4 text-blue-500" />
                                            <span className="font-medium">Founded:</span> {selectedLead.foundingYear}
                                          </div>
                                        )}
                                        {selectedLead.revenue && (
                                          <div className="flex items-center gap-2 text-gray-700">
                                            <DollarSign className="h-4 w-4 text-green-500" />
                                            <span className="font-medium">Revenue:</span> {selectedLead.revenue}
                                          </div>
                                        )}
                                      </div>
                                      
                                      {selectedLead.technologies && (
                                        <div>
                                          <h5 className="font-medium text-gray-900 mb-2">Tech Stack</h5>
                                          <div className="flex flex-wrap gap-1">
                                            {JSON.parse(selectedLead.technologies).map((tech: string, index: number) => (
                                              <Badge key={index} variant="secondary" className="text-xs">
                                                {tech}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
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
                                    <h4 className="font-medium text-yellow-900 mb-2 flex items-center gap-2">
                                      <StickyNote className="h-4 w-4" />
                                      Notes
                                    </h4>
                                    <p className="text-yellow-800 text-sm">{selectedLead.notes}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({leadsData?.total || 0} total leads)
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
  );
}