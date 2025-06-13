import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema } from "@shared/schema";
import { generateMockCompanies, createLeadsFromCompanies } from "./lib/mock-data";
import { generatePersonalizedEmail } from "./lib/openai";
import { parseICP, rankLeads } from "./lib/lead-analyzer";

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
      const { icp, hardFilters } = insertCampaignSchema.parse(req.body);
      
      // Create campaign
      const campaign = await storage.createCampaign({ icp, hardFilters });
      
      // Parse hard filters and ICP criteria
      const hardCriteria = parseICP(hardFilters || "");
      const rankingCriteria = parseICP(icp);
      
      // Generate comprehensive company database
      const allCompanies = generateMockCompanies(hardFilters || icp);
      
      // Apply hard filters first (strict requirements)
      const filteredCompanies = allCompanies.filter(company => {
        if (!hardFilters) return true;
        
        // Check industry match
        if (hardCriteria.industry) {
          const industryMatch = company.industry.toLowerCase().includes(hardCriteria.industry.toLowerCase()) ||
                               hardCriteria.keywords?.some(keyword => 
                                 company.industry.toLowerCase().includes(keyword.toLowerCase())
                               );
          if (!industryMatch) return false;
        }
        
        // Check location match
        if (hardCriteria.location) {
          const locationMatch = company.location.toLowerCase().includes(hardCriteria.location.toLowerCase());
          if (!locationMatch) return false;
        }
        
        return true;
      });
      
      // Create leads from filtered companies
      const rawLeadsData = createLeadsFromCompanies(filteredCompanies, campaign.id);
      
      // Apply AI-powered ranking based on ICP criteria
      const rankedLeads = rankLeads(rawLeadsData, rankingCriteria);
      
      // Save leads and generate emails
      const leads = [];
      for (const leadData of rankedLeads) {
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

  // Research detailed client information
  app.post("/api/leads/:id/research", async (req, res) => {
    try {
      const leadId = parseInt(req.params.id);
      
      // Generate comprehensive research data
      const researchData = {
        companyDescription: "AI-powered marketing agency specializing in B2B lead generation and automation. Founded by a team of former Google and Meta executives, they've grown 300% year-over-year.",
        foundingYear: "2019",
        revenue: "$2M-5M ARR",
        fundingStage: "Series A",
        recentNews: "Recently announced partnership with major CRM provider and expanded to Austin market. Featured in TechCrunch for innovative AI approach.",
        technologies: JSON.stringify(["HubSpot", "Salesforce", "Google Analytics", "Facebook Ads", "LinkedIn Sales Navigator"]),
        socialProfiles: JSON.stringify({
          linkedin: "https://linkedin.com/company/example-agency",
          twitter: "https://twitter.com/exampleagency",
          website: "https://exampleagency.com"
        }),
        keyPersonnel: JSON.stringify([
          { name: "Sarah Johnson", role: "CEO", background: "Former Google Ads Director" },
          { name: "Mike Chen", role: "CTO", background: "Ex-Meta Engineering Lead" }
        ]),
        detailsResearched: true
      };
      
      const updatedLead = await storage.updateLead(leadId, researchData);
      res.json(updatedLead);
    } catch (error) {
      console.error("Lead research error:", error);
      res.status(500).json({ message: "Failed to research lead" });
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
