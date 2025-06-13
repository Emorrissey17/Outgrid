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
