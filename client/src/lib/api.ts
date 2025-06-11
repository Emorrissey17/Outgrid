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
  emailContent?: string;
  status: string;
  sentAt?: string;
}

export interface Stats {
  id: number;
  leadsGenerated: number;
  messagesSent: number;
  responses: number;
}

export const api = {
  async createCampaign(icp: string): Promise<{ campaign: Campaign; leads: Lead[] }> {
    const response = await apiRequest("POST", "/api/campaigns", { icp });
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
};
