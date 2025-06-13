import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  icp: text("icp").notNull(),
  hardFilters: text("hard_filters"), // JSON string for strict requirements like "marketing agencies in US"
  status: text("status").notNull().default("processing"), // processing, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  campaignId: integer("campaign_id").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  email: text("email").notNull(),
  linkedinUrl: text("linkedin_url"),
  avatar: text("avatar"),
  emailSubject: text("email_subject"),
  emailContent: text("email_content"),
  status: text("status").notNull().default("ready"), // ready, sent, responded
  sentAt: timestamp("sent_at"),
  // Enhanced CRM fields
  companySize: text("company_size"), // e.g., "20 employees", "5-25 employees"
  industry: text("industry"),
  location: text("location"),
  matchScore: integer("match_score").default(0), // 0-100 ranking score
  matchReason: text("match_reason"), // Why this lead was ranked this way
  // Detailed client research fields
  companyDescription: text("company_description"),
  foundingYear: text("founding_year"),
  revenue: text("revenue"),
  fundingStage: text("funding_stage"),
  recentNews: text("recent_news"),
  technologies: text("technologies"), // JSON array of tech stack
  socialProfiles: text("social_profiles"), // JSON object with social links
  keyPersonnel: text("key_personnel"), // JSON array of leadership
  detailsResearched: boolean("details_researched").default(false),
  // User interaction fields
  notes: text("notes"),
  starred: boolean("starred").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  leadsGenerated: integer("leads_generated").notNull().default(0),
  messagesSent: integer("messages_sent").notNull().default(0),
  responses: integer("responses").notNull().default(0),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  icp: true,
  hardFilters: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  sentAt: true,
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
});

// Relations
export const campaignsRelations = relations(campaigns, ({ many }) => ({
  leads: many(leads),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.id],
  }),
}));

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Stats = typeof stats.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
