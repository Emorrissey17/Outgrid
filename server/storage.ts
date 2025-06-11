import { campaigns, leads, stats, type Campaign, type Lead, type Stats, type InsertCampaign, type InsertLead, type InsertStats } from "@shared/schema";

export interface IStorage {
  // Campaign methods
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  updateCampaignStatus(id: number, status: string): Promise<void>;

  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadsByCampaign(campaignId: number): Promise<Lead[]>;
  updateLeadStatus(id: number, status: string): Promise<void>;
  getLeads(): Promise<Lead[]>;

  // Stats methods
  getStats(): Promise<Stats>;
  updateStats(stats: Partial<InsertStats>): Promise<void>;
  incrementMessagesSent(): Promise<void>;
}

export class MemStorage implements IStorage {
  private campaigns: Map<number, Campaign>;
  private leads: Map<number, Lead>;
  private stats: Stats;
  private currentCampaignId: number;
  private currentLeadId: number;

  constructor() {
    this.campaigns = new Map();
    this.leads = new Map();
    this.currentCampaignId = 1;
    this.currentLeadId = 1;
    this.stats = {
      id: 1,
      leadsGenerated: 0,
      messagesSent: 0,
      responses: 0,
    };
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      status: "processing",
      createdAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async updateCampaignStatus(id: number, status: string): Promise<void> {
    const campaign = this.campaigns.get(id);
    if (campaign) {
      campaign.status = status;
      this.campaigns.set(id, campaign);
    }
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = this.currentLeadId++;
    const lead: Lead = {
      ...insertLead,
      id,
      sentAt: null,
    };
    this.leads.set(id, lead);
    
    // Update stats
    this.stats.leadsGenerated++;
    
    return lead;
  }

  async getLeadsByCampaign(campaignId: number): Promise<Lead[]> {
    return Array.from(this.leads.values()).filter(
      (lead) => lead.campaignId === campaignId,
    );
  }

  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async updateLeadStatus(id: number, status: string): Promise<void> {
    const lead = this.leads.get(id);
    if (lead) {
      lead.status = status;
      if (status === "sent") {
        lead.sentAt = new Date();
      }
      this.leads.set(id, lead);
    }
  }

  async getStats(): Promise<Stats> {
    return this.stats;
  }

  async updateStats(newStats: Partial<InsertStats>): Promise<void> {
    this.stats = { ...this.stats, ...newStats };
  }

  async incrementMessagesSent(): Promise<void> {
    this.stats.messagesSent++;
  }
}

export const storage = new MemStorage();
