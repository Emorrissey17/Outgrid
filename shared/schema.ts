import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  icp: text("icp").notNull(),
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
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  leadsGenerated: integer("leads_generated").notNull().default(0),
  messagesSent: integer("messages_sent").notNull().default(0),
  responses: integer("responses").notNull().default(0),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  icp: true,
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
