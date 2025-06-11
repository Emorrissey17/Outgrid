import { type InsertLead } from "@shared/schema";

export interface MockCompany {
  name: string;
  industry: string;
  size: string;
  location: string;
  contacts: {
    name: string;
    title: string;
    email: string;
    linkedinUrl: string;
    avatar: string;
  }[];
}

export function generateMockCompanies(icp: string): MockCompany[] {
  // Generate realistic companies based on ICP
  const companies: MockCompany[] = [
    {
      name: "Austin Digital Solutions",
      industry: "Digital Marketing",
      size: "15-25 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Sarah Johnson",
          title: "Marketing Director",
          email: "sarah.johnson@austindigital.com",
          linkedinUrl: "/in/sarah-johnson-marketing",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Growth Labs Marketing",
      industry: "Growth Marketing",
      size: "8-15 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Michael Chen",
          title: "Founder & CEO",
          email: "michael@growthlabs.co",
          linkedinUrl: "/in/michael-chen-ceo",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Stellar Creative Agency",
      industry: "Creative Marketing",
      size: "20-30 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Emily Rodriguez",
          title: "VP of Marketing",
          email: "emily.r@stellarcreative.com",
          linkedinUrl: "/in/emily-rodriguez-marketing",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Peak Performance Digital",
      industry: "Performance Marketing",
      size: "12-18 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "David Park",
          title: "Head of Client Success",
          email: "david@peakperformance.digital",
          linkedinUrl: "/in/david-park-marketing",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Amplify Marketing Co",
      industry: "Brand Marketing",
      size: "10-20 employees", 
      location: "Austin, TX",
      contacts: [
        {
          name: "Jessica Liu",
          title: "Creative Director",
          email: "jessica@amplifymarketing.co",
          linkedinUrl: "/in/jessica-liu-creative",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Conversion Studio",
      industry: "Conversion Optimization",
      size: "6-12 employees",
      location: "Austin, TX", 
      contacts: [
        {
          name: "Alex Thompson",
          title: "Optimization Specialist",
          email: "alex@conversionstudio.com",
          linkedinUrl: "/in/alex-thompson-cro",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    }
  ];

  return companies;
}

export function createLeadsFromCompanies(companies: MockCompany[], campaignId: number): InsertLead[] {
  const leads: InsertLead[] = [];
  
  companies.forEach(company => {
    company.contacts.forEach(contact => {
      leads.push({
        campaignId,
        name: contact.name,
        title: contact.title,
        company: company.name,
        email: contact.email,
        linkedinUrl: contact.linkedinUrl,
        avatar: contact.avatar,
        emailContent: "", // Will be populated by AI
        status: "ready"
      });
    });
  });

  return leads;
}
