import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema } from "@shared/schema";
import { generateMockCompanies, createLeadsFromCompanies } from "./lib/mock-data";
import { generatePersonalizedEmail } from "./lib/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get all leads
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  // Create a new campaign and generate leads
  app.post("/api/campaigns", async (req, res) => {
    try {
      const { icp } = insertCampaignSchema.parse(req.body);
      
      // Create campaign
      const campaign = await storage.createCampaign({ icp });
      
      // Generate mock companies
      const companies = generateMockCompanies(icp);
      
      // Create leads from companies
      const leadsData = createLeadsFromCompanies(companies, campaign.id);
      
      // Save leads and generate emails
      const leads = [];
      for (const leadData of leadsData) {
        try {
          // Generate personalized email using OpenAI
          const emailResult = await generatePersonalizedEmail({
            leadName: leadData.name,
            leadTitle: leadData.title,
            leadCompany: leadData.company,
            icp: icp
          });
          
          leadData.emailSubject = emailResult.subject;
          leadData.emailContent = emailResult.content;
        } catch (error) {
          console.error(`Failed to generate email for ${leadData.name}:`, error);
          // Use fallback email content
          leadData.emailSubject = `Partnership Opportunity - ${leadData.company}`;
          leadData.emailContent = `Hi ${leadData.name},\n\nI noticed ${leadData.company} and thought you might be interested in our solutions.\n\nWould you be open to a brief conversation?\n\nBest regards`;
        }
        
        const lead = await storage.createLead(leadData);
        leads.push(lead);
      }
      
      // Update campaign status
      await storage.updateCampaignStatus(campaign.id, "completed");
      
      res.json({ campaign, leads });
    } catch (error) {
      console.error("Campaign creation error:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // Update a lead
  app.patch("/api/leads/:id", async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      const updateData = req.body;
      
      const updatedLead = await storage.updateLead(leadId, updateData);
      res.json(updatedLead);
    } catch (error) {
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  // Send selected emails in bulk
  app.post("/api/leads/send-selected", async (req, res) => {
    try {
      const { leadIds } = req.body;
      
      if (!Array.isArray(leadIds) || leadIds.length === 0) {
        return res.status(400).json({ message: "Invalid lead IDs" });
      }
      
      let sentCount = 0;
      for (const leadId of leadIds) {
        try {
          await storage.updateLeadStatus(leadId, "sent");
          await storage.incrementMessagesSent();
          sentCount++;
        } catch (error) {
          console.error(`Failed to send email for lead ${leadId}:`, error);
        }
      }
      
      res.json({ message: "Emails sent successfully", sent: sentCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to send emails" });
    }
  });

  // Send an email (simulate)
  app.post("/api/leads/:id/send", async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      
      // Update lead status
      await storage.updateLeadStatus(leadId, "sent");
      
      // Increment messages sent
      await storage.incrementMessagesSent();
      
      res.json({ message: "Email sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
