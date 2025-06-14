import { apiRequest } from "./queryClient";

export interface Campaign {
  id: number;
  icp: string;
  status: string;
  createdAt: string;
}

export interface Lead {
  id: number;
  campaignId: number;
  name: string;
  title: string;
  company: string;
  email: string;
  linkedinUrl?: string;
  avatar?: string;
  emailSubject?: string;
  emailContent?: string;
  status: string;
  sentAt?: string;
  companySize?: string;
  industry?: string;
  location?: string;
  matchScore?: number;
  matchReason?: string;
  // Detailed research fields
  companyDescription?: string;
  foundingYear?: string;
  revenue?: string;
  fundingStage?: string;
  recentNews?: string;
  technologies?: string; // JSON array
  socialProfiles?: string; // JSON object
  keyPersonnel?: string; // JSON array
  detailsResearched?: boolean;
  // User interaction fields
  notes?: string;
  starred?: boolean;
  createdAt?: string;
}

export interface Stats {
  id: number;
  leadsGenerated: number;
  messagesSent: number;
  responses: number;
}

export const api = {
  async createCampaign(icp: string, hardFilters?: string): Promise<{ campaign: Campaign; leads: Lead[] }> {
    const response = await apiRequest("POST", "/api/campaigns", { icp, hardFilters });
    return response.json();
  },

  async researchLead(leadId: number): Promise<Lead> {
    const response = await apiRequest("POST", `/api/leads/${leadId}/research`);
    return response.json();
  },

  async updateLeadNotes(leadId: number, notes: string): Promise<Lead> {
    const response = await apiRequest("PATCH", `/api/leads/${leadId}`, { notes });
    return response.json();
  },

  async toggleLeadStar(leadId: number, starred: boolean): Promise<Lead> {
    const response = await apiRequest("PATCH", `/api/leads/${leadId}`, { starred });
    return response.json();
  },

  async getLeadsPaginated(page: number = 1, limit: number = 20): Promise<{ leads: Lead[]; total: number; totalPages: number }> {
    const response = await apiRequest("GET", `/api/leads/paginated?page=${page}&limit=${limit}`);
    return response.json();
  },

  async getStats(): Promise<Stats> {
    const response = await apiRequest("GET", "/api/stats");
    return response.json();
  },

  async getLeads(): Promise<Lead[]> {
    const response = await apiRequest("GET", "/api/leads");
    return response.json();
  },

  async sendEmail(leadId: number): Promise<{ message: string }> {
    const response = await apiRequest("POST", `/api/leads/${leadId}/send`);
    return response.json();
  },

  async generateEmails(campaignId: number): Promise<{ message: string }> {
    const response = await apiRequest("POST", `/api/campaigns/${campaignId}/generate-emails`);
    return response.json();
  },

  async updateLead(leadId: number, data: { emailSubject?: string; emailContent?: string }): Promise<Lead> {
    const response = await apiRequest("PATCH", `/api/leads/${leadId}`, data);
    return response.json();
  },

  async sendSelectedEmails(leadIds: number[]): Promise<{ message: string; sent: number }> {
    const response = await apiRequest("POST", "/api/leads/send-selected", { leadIds });
    return response.json();
  },
};
