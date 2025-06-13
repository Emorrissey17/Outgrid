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
  // Comprehensive database of mock companies across different industries and locations
  const allCompanies: MockCompany[] = [
    // Marketing Agencies - Austin (Perfect matches)
    {
      name: "Austin Digital Solutions",
      industry: "Digital Marketing Agency",
      size: "18 employees",
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
      industry: "Growth Marketing Agency",
      size: "12 employees",
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
      name: "Lone Star Creative Agency",
      industry: "Creative Marketing Agency",
      size: "22 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Jessica Rodriguez",
          title: "Creative Director",
          email: "jessica@lonestar.agency",
          linkedinUrl: "/in/jessica-rodriguez-creative",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Capital City Marketing",
      industry: "Full-Service Marketing Agency",
      size: "8 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "David Kim",
          title: "Managing Partner",
          email: "david@capitalcitymarketing.com",
          linkedinUrl: "/in/david-kim-marketing",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Marketing Agencies - Austin (Outside range but still relevant)
    {
      name: "Big Sky Marketing Group",
      industry: "Marketing Agency",
      size: "45 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Amanda Foster",
          title: "VP of Client Services",
          email: "amanda@bigskymarketing.com",
          linkedinUrl: "/in/amanda-foster-marketing",
          avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Micro Marketing Co",
      industry: "Boutique Marketing Agency",
      size: "3 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Tom Wilson",
          title: "Owner",
          email: "tom@micromarketing.co",
          linkedinUrl: "/in/tom-wilson-marketing",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Marketing Agencies - Near Austin
    {
      name: "Round Rock Digital",
      industry: "Digital Marketing Agency",
      size: "15 employees",
      location: "Round Rock, TX",
      contacts: [
        {
          name: "Lisa Chang",
          title: "CEO",
          email: "lisa@roundrockdigital.com",
          linkedinUrl: "/in/lisa-chang-digital",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Cedar Park Creative",
      industry: "Marketing & Advertising Agency",
      size: "19 employees",
      location: "Cedar Park, TX",
      contacts: [
        {
          name: "Robert Taylor",
          title: "Creative Director",
          email: "robert@cedarparkcreatve.com",
          linkedinUrl: "/in/robert-taylor-creative",
          avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Other Industries - Austin (Should rank lower for marketing agency searches)
    {
      name: "Austin Tech Consulting",
      industry: "Technology Consulting",
      size: "25 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Jennifer Park",
          title: "Director of Operations",
          email: "jennifer@austintech.co",
          linkedinUrl: "/in/jennifer-park-ops",
          avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Hill Country Real Estate",
      industry: "Real Estate",
      size: "12 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Mark Davis",
          title: "Broker",
          email: "mark@hillcountryrealty.com",
          linkedinUrl: "/in/mark-davis-realtor",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
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
    // Marketing Agencies - Chicago
    {
      name: "Chicago Marketing Hub",
      industry: "Digital Marketing",
      size: "25-35 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Robert Williams",
          title: "Creative Director",
          email: "robert@chicagomarketing.com",
          linkedinUrl: "/in/robert-williams-creative",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Windy City Digital",
      industry: "Performance Marketing",
      size: "12-20 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Amanda Davis",
          title: "Account Manager",
          email: "amanda@windycitydigital.com",
          linkedinUrl: "/in/amanda-davis-marketing",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    // Dental Practices - Chicago
    {
      name: "Chicago Family Dentistry",
      industry: "Dental Practice",
      size: "8-12 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Dr. James Miller",
          title: "Practice Owner",
          email: "jmiller@chicagofamilydental.com",
          linkedinUrl: "/in/dr-james-miller-dds",
          avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Smile Solutions Chicago",
      industry: "Dental Practice",
      size: "15-20 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Dr. Lisa Garcia",
          title: "Lead Dentist",
          email: "lgarcia@smilesolutionschicago.com",
          linkedinUrl: "/in/dr-lisa-garcia-dds",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Premier Dental Group",
      industry: "Dental Practice",
      size: "25-30 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Dr. Michael Thompson",
          title: "Managing Partner",
          email: "mthompson@premierdentalgroup.com",
          linkedinUrl: "/in/dr-michael-thompson-dds",
          avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    // Consulting Businesses - Austin
    {
      name: "Strategic Growth Consultants",
      industry: "Business Consulting",
      size: "10-15 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Jennifer Lee",
          title: "Senior Consultant",
          email: "jennifer@strategicgrowth.com",
          linkedinUrl: "/in/jennifer-lee-consultant",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Austin Business Solutions",
      industry: "Management Consulting",
      size: "20-25 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "David Kim",
          title: "Managing Director",
          email: "david@austinbusiness.com",
          linkedinUrl: "/in/david-kim-consulting",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    // Tech Companies - San Francisco
    {
      name: "Bay Area Tech Solutions",
      industry: "Software Development",
      size: "50-75 employees",
      location: "San Francisco, CA",
      contacts: [
        {
          name: "Alex Chen",
          title: "CTO",
          email: "alex@bayareatech.com",
          linkedinUrl: "/in/alex-chen-cto",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    // Law Firms - New York
    {
      name: "Manhattan Legal Partners",
      industry: "Legal Services",
      size: "30-40 employees",
      location: "New York, NY",
      contacts: [
        {
          name: "Sarah Peterson",
          title: "Managing Partner",
          email: "speterson@manhattanlegal.com",
          linkedinUrl: "/in/sarah-peterson-attorney",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
        }
      ]
    }
  ];

  // Filter companies based on ICP keywords
  return filterCompaniesByICP(allCompanies, icp);
}

function filterCompaniesByICP(companies: MockCompany[], icp: string): MockCompany[] {
  const icpLower = icp.toLowerCase();
  
  return companies.filter(company => {
    // Check location match
    const extractedLocation = extractLocation(icpLower);
    const locationMatch = extractedLocation === "" || company.location.toLowerCase().includes(extractedLocation);
    
    // Check industry/type match
    const industryMatch = checkIndustryMatch(company.industry.toLowerCase(), icpLower);
    
    return locationMatch && industryMatch;
  });
}

function extractLocation(icp: string): string {
  const locationKeywords = [
    'austin', 'chicago', 'san francisco', 'new york', 'dallas', 'houston',
    'los angeles', 'seattle', 'denver', 'atlanta', 'miami', 'boston'
  ];
  
  for (const location of locationKeywords) {
    if (icp.includes(location)) {
      return location;
    }
  }
  return "";
}

function checkIndustryMatch(companyIndustry: string, icp: string): boolean {
  // If no specific industry mentioned in ICP, return all
  if (!hasIndustryKeywords(icp)) {
    return true;
  }
  
  // Marketing-related keywords
  if (icp.includes('marketing') || icp.includes('agency') || icp.includes('advertising')) {
    return companyIndustry.includes('marketing') || companyIndustry.includes('creative');
  }
  
  // Dental-related keywords
  if (icp.includes('dental') || icp.includes('dentist') || icp.includes('orthodont')) {
    return companyIndustry.includes('dental');
  }
  
  // Consulting-related keywords
  if (icp.includes('consulting') || icp.includes('consultant')) {
    return companyIndustry.includes('consulting');
  }
  
  // Tech-related keywords
  if (icp.includes('tech') || icp.includes('software') || icp.includes('startup')) {
    return companyIndustry.includes('software') || companyIndustry.includes('tech');
  }
  
  // Legal-related keywords
  if (icp.includes('law') || icp.includes('legal') || icp.includes('attorney')) {
    return companyIndustry.includes('legal');
  }
  
  return false;
}

function hasIndustryKeywords(icp: string): boolean {
  const industryKeywords = [
    'marketing', 'agency', 'advertising', 'dental', 'dentist', 'orthodont',
    'consulting', 'consultant', 'tech', 'software', 'startup', 'law', 'legal', 'attorney'
  ];
  
  return industryKeywords.some(keyword => icp.includes(keyword));
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
