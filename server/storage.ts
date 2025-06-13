import { campaigns, leads, stats, type Campaign, type Lead, type Stats, type InsertCampaign, type InsertLead, type InsertStats } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Campaign methods
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  updateCampaignStatus(id: number, status: string): Promise<void>;

  // Lead methods
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadsByCampaign(campaignId: number): Promise<Lead[]>;
  updateLeadStatus(id: number, status: string): Promise<void>;
  updateLead(id: number, data: Partial<InsertLead>): Promise<Lead>;
  getLeads(): Promise<Lead[]>;

  // Stats methods
  getStats(): Promise<Stats>;
  updateStats(stats: Partial<InsertStats>): Promise<void>;
  incrementMessagesSent(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const [campaign] = await db
      .insert(campaigns)
      .values(insertCampaign)
      .returning();
    return campaign;
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign || undefined;
  }

  async updateCampaignStatus(id: number, status: string): Promise<void> {
    await db
      .update(campaigns)
      .set({ status })
      .where(eq(campaigns.id, id));
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    
    // Update stats
    await this.incrementLeadsGenerated();
    
    return lead;
  }

  async getLeadsByCampaign(campaignId: number): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.campaignId, campaignId))
      .orderBy(desc(leads.id));
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.id));
  }

  async updateLeadStatus(id: number, status: string): Promise<void> {
    const updateData: any = { status };
    if (status === "sent") {
      updateData.sentAt = new Date();
    }
    
    await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, id));
  }

  async updateLead(id: number, data: Partial<InsertLead>): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set(data)
      .where(eq(leads.id, id))
      .returning();
    
    if (!updatedLead) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    return updatedLead;
  }

  async getStats(): Promise<Stats> {
    let [statsRecord] = await db.select().from(stats).where(eq(stats.id, 1));
    
    if (!statsRecord) {
      // Initialize stats if they don't exist
      [statsRecord] = await db
        .insert(stats)
        .values({
          leadsGenerated: 0,
          messagesSent: 0,
          responses: 0,
        })
        .returning();
    }
    
    return statsRecord;
  }

  async updateStats(newStats: Partial<InsertStats>): Promise<void> {
    await db
      .update(stats)
      .set(newStats)
      .where(eq(stats.id, 1));
  }

  async incrementMessagesSent(): Promise<void> {
    const currentStats = await this.getStats();
    await this.updateStats({
      messagesSent: currentStats.messagesSent + 1,
    });
  }

  private async incrementLeadsGenerated(): Promise<void> {
    const currentStats = await this.getStats();
    await this.updateStats({
      leadsGenerated: currentStats.leadsGenerated + 1,
    });
  }
}

export const storage = new DatabaseStorage();
