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

  // Get paginated leads
  app.get("/api/leads/paginated", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      const allLeads = await storage.getLeads();
      const total = allLeads.length;
      const totalPages = Math.ceil(total / limit);
      const leads = allLeads.slice(offset, offset + limit);
      
      res.json({ leads, total, totalPages, currentPage: page });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch paginated leads" });
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

  // Create sample leads for testing
  app.post("/api/leads/create-samples", async (req, res) => {
    try {
      const sampleLeads = [
        {
          name: "Sarah Chen", title: "Marketing Director", company: "TechFlow Solutions", email: "sarah.chen@techflow.com",
          linkedinUrl: "https://linkedin.com/in/sarah-chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
          emailSubject: "Partnership Opportunity - Marketing Automation", 
          emailContent: "Hi Sarah,\n\nI noticed TechFlow Solutions' recent expansion into AI-powered marketing tools and thought you might be interested in our lead generation platform.\n\nWould you be open to a brief conversation about how we could help accelerate your client acquisition?\n\nBest regards",
          status: "ready", companySize: "25 employees", industry: "Marketing Technology", location: "Austin, TX",
          matchScore: 92, matchReason: "Perfect fit: Marketing technology company in Austin with ideal team size (25 employees). Recent AI focus aligns with our solutions.",
          starred: true, notes: "High priority - recently funded Series A, expanding rapidly"
        },
        {
          name: "Michael Rodriguez", title: "CEO", company: "Creative Minds Agency", email: "mike@creativeminds.co",
          linkedinUrl: "https://linkedin.com/in/mike-rodriguez", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          emailSubject: "Scaling Your Agency Operations",
          emailContent: "Hi Michael,\n\nAs a fellow entrepreneur, I understand the challenges of scaling an agency. Creative Minds has impressive growth, and I'd love to share how we've helped similar agencies streamline their lead generation.\n\nInterested in a quick chat?\n\nCheers",
          status: "ready", companySize: "18 employees", industry: "Creative Agency", location: "Austin, TX",
          matchScore: 88, matchReason: "Strong match: Creative agency in target location with optimal size. CEO-level contact increases conversion potential.",
          notes: "Reached out via LinkedIn last month, very responsive"
        },
        {
          name: "Emily Watson", title: "VP of Growth", company: "DataDriven Marketing", email: "emily.watson@datadriven.com",
          linkedinUrl: "https://linkedin.com/in/emily-watson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
          emailSubject: "Supercharge Your Data-Driven Campaigns",
          emailContent: "Hi Emily,\n\nYour work at DataDriven Marketing caught my attention - particularly your recent case study on improving conversion rates by 340%.\n\nI'd love to show you how our platform could amplify those results even further.\n\nBest",
          status: "ready", companySize: "32 employees", industry: "Digital Marketing", location: "Austin, TX",
          matchScore: 85, matchReason: "Good match: Digital marketing focus with growth-oriented leadership. Slightly larger than ideal size but strong potential.",
          starred: false
        },
        {
          name: "David Kim", title: "Founder", company: "InnovateAustin", email: "david@innovateaustin.com",
          linkedinUrl: "https://linkedin.com/in/david-kim-austin", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          emailSubject: "Innovation Meets Lead Generation",
          emailContent: "Hi David,\n\nI've been following InnovateAustin's journey and am impressed by your commitment to fostering local startups.\n\nI think our lead generation platform could be valuable for both your agency and the startups you work with.\n\nWould you be interested in exploring this?\n\nBest regards",
          status: "ready", companySize: "12 employees", industry: "Startup Consulting", location: "Austin, TX",
          matchScore: 82, matchReason: "Solid match: Local Austin founder with startup focus. Smaller team size but high influence in ecosystem.",
          notes: "Connects with many local startups - potential for referrals"
        },
        {
          name: "Jennifer Lopez", title: "Marketing Manager", company: "BrandBuilders Co", email: "jen.lopez@brandbuilders.co",
          linkedinUrl: "https://linkedin.com/in/jennifer-lopez-marketing", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
          emailSubject: "Elevating BrandBuilders' Client Acquisition",
          emailContent: "Hi Jennifer,\n\nBrandBuilders has built an impressive portfolio, and I believe we could help you attract even more high-quality clients.\n\nOur platform has helped similar branding agencies increase qualified leads by 200%.\n\nInterested in learning more?\n\nBest",
          status: "ready", companySize: "28 employees", industry: "Branding Agency", location: "Austin, TX",
          matchScore: 79, matchReason: "Good fit: Branding agency in Austin with suitable team size. Strong portfolio suggests quality focus.",
          starred: false
        },
        {
          name: "Alex Thompson", title: "Head of Digital", company: "Growth Hackers Inc", email: "alex@growthhackers.com",
          linkedinUrl: "https://linkedin.com/in/alex-thompson", avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150",
          emailSubject: "Growth Hacking Meets Lead Generation",
          emailContent: "Hi Alex,\n\nYour growth hacking strategies at Growth Hackers Inc have been impressive. I think our lead generation platform could be a perfect addition to your toolkit.\n\nWould you be interested in exploring how we could help scale your client acquisition even further?\n\nBest regards",
          status: "ready", companySize: "15 employees", industry: "Growth Marketing", location: "San Francisco, CA",
          matchScore: 87, matchReason: "Excellent match: Growth-focused agency with lean team. San Francisco location adds diversity to portfolio.",
          starred: true, notes: "Former Y Combinator mentor - high influence in startup community"
        },
        {
          name: "Rachel Green", title: "Marketing Lead", company: "EcoMarketing Co", email: "rachel@ecomarketing.com",
          linkedinUrl: "https://linkedin.com/in/rachel-green-eco", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
          emailSubject: "Sustainable Growth for EcoMarketing",
          emailContent: "Hi Rachel,\n\nI admire EcoMarketing's commitment to sustainable business practices. Our lead generation platform aligns with values-driven companies like yours.\n\nI'd love to discuss how we could help you grow while maintaining your environmental focus.\n\nBest",
          status: "ready", companySize: "22 employees", industry: "Sustainable Marketing", location: "Portland, OR",
          matchScore: 75, matchReason: "Good fit: Sustainable focus with medium team size. Portland location expands geographic reach.",
          notes: "B-Corp certified, values alignment important"
        },
        {
          name: "Carlos Martinez", title: "Agency Owner", company: "Latino Marketing Hub", email: "carlos@latinomarketing.com",
          linkedinUrl: "https://linkedin.com/in/carlos-martinez-marketing", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
          emailSubject: "Expanding Latino Marketing Hub's Reach",
          emailContent: "Hola Carlos,\n\nLatino Marketing Hub's work in multicultural marketing is fantastic. I believe our platform could help you reach even more businesses looking for authentic cultural marketing.\n\nWould you be open to a conversation?\n\nSaludos",
          status: "ready", companySize: "19 employees", industry: "Multicultural Marketing", location: "Miami, FL",
          matchScore: 83, matchReason: "Strong match: Specialized niche with growth potential. Miami location adds East Coast presence.",
          starred: false, notes: "Specializes in Hispanic market - unique positioning"
        },
        {
          name: "Dr. Amanda Singh", title: "Founder & CEO", company: "HealthTech Marketing", email: "amanda@healthtechmarketing.com",
          linkedinUrl: "https://linkedin.com/in/dr-amanda-singh", avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
          emailSubject: "Healthcare Marketing Innovation",
          emailContent: "Hi Dr. Singh,\n\nYour expertise in healthcare marketing is impressive, especially your recent work with telemedicine companies.\n\nI think our lead generation platform could help HealthTech Marketing scale its impact in the rapidly growing healthtech sector.\n\nBest regards",
          status: "ready", companySize: "35 employees", industry: "Healthcare Marketing", location: "Boston, MA",
          matchScore: 78, matchReason: "Solid match: Healthcare niche with strong growth. Larger team size but high-value sector.",
          notes: "MD + MBA background, very analytical approach"
        },
        {
          name: "Tom Wilson", title: "Creative Director", company: "Visual Impact Agency", email: "tom@visualimpact.co",
          linkedinUrl: "https://linkedin.com/in/tom-wilson-creative", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
          emailSubject: "Creating Visual Impact in Lead Generation",
          emailContent: "Hi Tom,\n\nVisual Impact Agency's portfolio is stunning. I believe our lead generation platform could help you attract more clients who appreciate high-quality creative work.\n\nWould you be interested in learning how we've helped other creative agencies scale?\n\nBest",
          status: "ready", companySize: "14 employees", industry: "Creative Design", location: "New York, NY",
          matchScore: 71, matchReason: "Moderate match: Creative focus with small team. NYC location valuable but competitive market.",
          starred: false
        },
        {
          name: "Lisa Park", title: "VP Marketing", company: "TechStartup Solutions", email: "lisa.park@techstartup.com",
          linkedinUrl: "https://linkedin.com/in/lisa-park-tech", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
          emailSubject: "Scaling TechStartup Solutions",
          emailContent: "Hi Lisa,\n\nTechStartup Solutions' rapid growth in the SaaS space is impressive. Our lead generation platform could help you maintain that momentum.\n\nI'd love to share how we've helped other B2B tech companies scale their customer acquisition.\n\nBest regards",
          status: "ready", companySize: "45 employees", industry: "B2B SaaS Marketing", location: "Seattle, WA",
          matchScore: 89, matchReason: "Excellent match: B2B SaaS focus with strong growth trajectory. Tech hub location ideal for expansion.",
          starred: true, notes: "Recently raised Series B, aggressive growth targets"
        },
        {
          name: "James O'Connor", title: "Managing Partner", company: "Midwest Marketing Co", email: "james@midwestmarketing.com",
          linkedinUrl: "https://linkedin.com/in/james-oconnor-midwest", avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150",
          emailSubject: "Bringing Innovation to Midwest Marketing",
          emailContent: "Hi James,\n\nMidwest Marketing's strong regional presence is impressive. I think our lead generation platform could help you compete with larger coastal agencies.\n\nWould you be open to discussing how technology could give you a competitive edge?\n\nBest",
          status: "ready", companySize: "27 employees", industry: "Regional Marketing", location: "Chicago, IL",
          matchScore: 76, matchReason: "Good fit: Regional agency with growth mindset. Midwest location underserved market opportunity.",
          notes: "Strong local connections, family-owned business"
        },
        {
          name: "Sophia Rodriguez", title: "Head of Growth", company: "Fintech Marketing Pro", email: "sophia@fintechpro.com",
          linkedinUrl: "https://linkedin.com/in/sophia-rodriguez-fintech", avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150",
          emailSubject: "Fintech Growth Acceleration",
          emailContent: "Hi Sophia,\n\nYour work in fintech marketing is cutting-edge. Given the regulatory complexities in finance, I believe our compliant lead generation platform could be invaluable.\n\nInterested in exploring how we could help Fintech Marketing Pro scale safely?\n\nBest regards",
          status: "ready", companySize: "31 employees", industry: "Financial Technology", location: "Charlotte, NC",
          matchScore: 85, matchReason: "Strong match: Fintech specialization with compliance awareness. Charlotte's financial sector presence adds value.",
          starred: false, notes: "Former Goldman Sachs, strong regulatory knowledge"
        },
        {
          name: "Kevin Chang", title: "Founder", company: "AI Marketing Labs", email: "kevin@aimarketinglabs.com",
          linkedinUrl: "https://linkedin.com/in/kevin-chang-ai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          emailSubject: "AI-Powered Marketing Innovation",
          emailContent: "Hi Kevin,\n\nAI Marketing Labs is at the forefront of marketing technology. I think our AI-enhanced lead generation platform could complement your existing tools perfectly.\n\nWould you be interested in exploring potential synergies?\n\nBest",
          status: "ready", companySize: "23 employees", industry: "AI Marketing", location: "Palo Alto, CA",
          matchScore: 94, matchReason: "Perfect match: AI focus aligns with our technology. Silicon Valley location ideal for tech adoption.",
          starred: true, notes: "PhD in Machine Learning, very technical founder"
        },
        {
          name: "Maria Gonzalez", title: "Marketing Director", company: "E-commerce Growth Co", email: "maria@ecommercegrowth.com",
          linkedinUrl: "https://linkedin.com/in/maria-gonzalez-ecommerce", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
          emailSubject: "Scaling E-commerce Marketing",
          emailContent: "Hi Maria,\n\nE-commerce Growth Co's client results speak for themselves. Our lead generation platform could help you attract more e-commerce brands looking for proven growth strategies.\n\nWould you be open to a conversation about scaling your agency?\n\nBest regards",
          status: "ready", companySize: "29 employees", industry: "E-commerce Marketing", location: "Los Angeles, CA",
          matchScore: 82, matchReason: "Strong match: E-commerce focus with proven results. LA location adds West Coast presence.",
          notes: "Specializes in D2C brands, strong ROI focus"
        },
        {
          name: "Robert Kim", title: "CEO", company: "Manufacturing Marketing Solutions", email: "robert@mfgmarketing.com",
          linkedinUrl: "https://linkedin.com/in/robert-kim-manufacturing", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
          emailSubject: "Modern Marketing for Manufacturing",
          emailContent: "Hi Robert,\n\nManufacturing Marketing Solutions fills an important niche. Many manufacturers struggle with digital marketing, and our lead generation platform could help you reach more of them.\n\nInterested in discussing how we could support your growth?\n\nBest",
          status: "ready", companySize: "21 employees", industry: "Manufacturing Marketing", location: "Detroit, MI",
          matchScore: 73, matchReason: "Good fit: Specialized B2B niche with steady demand. Detroit location adds Midwest industrial presence.",
          starred: false, notes: "20+ years manufacturing experience, knows the industry well"
        }
      ];

      const leads = [];
      for (const leadData of sampleLeads) {
        const lead = await storage.createLead({ ...leadData, campaignId: 1 });
        leads.push(lead);
      }

      res.json({ message: "Sample leads created", count: leads.length, leads });
    } catch (error) {
      console.error("Sample creation error:", error);
      res.status(500).json({ message: "Failed to create sample leads" });
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
