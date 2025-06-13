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

function extractIndustry(icp: string): string {
  const lowerIcp = icp.toLowerCase();
  if (lowerIcp.includes('marketing') || lowerIcp.includes('agency')) return 'marketing';
  if (lowerIcp.includes('tech') || lowerIcp.includes('software') || lowerIcp.includes('saas')) return 'technology';
  if (lowerIcp.includes('healthcare') || lowerIcp.includes('medical')) return 'healthcare';
  if (lowerIcp.includes('finance') || lowerIcp.includes('fintech')) return 'finance';
  if (lowerIcp.includes('retail') || lowerIcp.includes('ecommerce')) return 'retail';
  if (lowerIcp.includes('manufacturing')) return 'manufacturing';
  if (lowerIcp.includes('consulting')) return 'consulting';
  return 'general';
}

export function generateMockCompanies(icp: string): MockCompany[] {
  const targetLocation = extractLocation(icp);
  const targetIndustry = extractIndustry(icp);
  
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
    
    // San Francisco Tech Companies
    {
      name: "TechFlow Innovations",
      industry: "SaaS Technology",
      size: "32 employees",
      location: "San Francisco, CA",
      contacts: [
        {
          name: "Alex Chen",
          title: "Head of Growth",
          email: "alex@techflow.com",
          linkedinUrl: "/in/alex-chen-growth",
          avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Bay Area Marketing Hub",
      industry: "Digital Marketing Agency",
      size: "28 employees",
      location: "San Francisco, CA",
      contacts: [
        {
          name: "Rachel Park",
          title: "Creative Director",
          email: "rachel@bayareamarketing.com",
          linkedinUrl: "/in/rachel-park-creative",
          avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // New York Finance & Marketing
    {
      name: "Wall Street Marketing Co",
      industry: "Financial Marketing",
      size: "41 employees",
      location: "New York, NY",
      contacts: [
        {
          name: "James Rodriguez",
          title: "Managing Director",
          email: "james@wallstreetmarketing.com",
          linkedinUrl: "/in/james-rodriguez-finance",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "NYC Creative Agency",
      industry: "Creative Marketing",
      size: "15 employees",
      location: "New York, NY",
      contacts: [
        {
          name: "Sofia Martinez",
          title: "Founder & CEO",
          email: "sofia@nyccreative.com",
          linkedinUrl: "/in/sofia-martinez-creative",
          avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Chicago Business Services
    {
      name: "Midwest Marketing Solutions",
      industry: "B2B Marketing",
      size: "23 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Kevin Thompson",
          title: "VP of Operations",
          email: "kevin@midwestmarketing.com",
          linkedinUrl: "/in/kevin-thompson-operations",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Miami Healthcare Marketing
    {
      name: "Healthcare Marketing Pro",
      industry: "Healthcare Marketing",
      size: "19 employees",
      location: "Miami, FL",
      contacts: [
        {
          name: "Dr. Maria Lopez",
          title: "Medical Marketing Director",
          email: "maria@healthcaremarketing.com",
          linkedinUrl: "/in/dr-maria-lopez",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Seattle Technology
    {
      name: "Pacific Northwest Tech",
      industry: "Cloud Technology",
      size: "37 employees",
      location: "Seattle, WA",
      contacts: [
        {
          name: "Lisa Wong",
          title: "Head of Marketing",
          email: "lisa@pacificnwtech.com",
          linkedinUrl: "/in/lisa-wong-tech",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Boston Healthcare & Biotech
    {
      name: "BioTech Marketing Solutions",
      industry: "Biotech Marketing",
      size: "26 employees",
      location: "Boston, MA",
      contacts: [
        {
          name: "Dr. Robert Kim",
          title: "Scientific Marketing Lead",
          email: "robert@biotechmarketing.com",
          linkedinUrl: "/in/dr-robert-kim",
          avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Los Angeles Entertainment & Media
    {
      name: "Hollywood Marketing Group",
      industry: "Entertainment Marketing",
      size: "34 employees",
      location: "Los Angeles, CA",
      contacts: [
        {
          name: "Jennifer Davis",
          title: "Entertainment Director",
          email: "jennifer@hollywoodmarketing.com",
          linkedinUrl: "/in/jennifer-davis-entertainment",
          avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Denver Outdoor & Adventure
    {
      name: "Mountain Marketing Co",
      industry: "Outdoor Recreation Marketing",
      size: "14 employees",
      location: "Denver, CO",
      contacts: [
        {
          name: "Mike Johnson",
          title: "Outdoor Marketing Specialist",
          email: "mike@mountainmarketing.com",
          linkedinUrl: "/in/mike-johnson-outdoor",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Phoenix Real Estate & Construction
    {
      name: "Desert Marketing Solutions",
      industry: "Real Estate Marketing",
      size: "21 employees",
      location: "Phoenix, AZ",
      contacts: [
        {
          name: "Sarah Thompson",
          title: "Real Estate Marketing Lead",
          email: "sarah@desertmarketing.com",
          linkedinUrl: "/in/sarah-thompson-realestate",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
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
    },
    
    // Additional Tech Companies - Multiple Cities
    {
      name: "CloudFirst Solutions",
      industry: "Cloud Technology",
      size: "45-60 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Marcus Johnson",
          title: "VP of Growth", 
          email: "marcus@cloudfirst.com",
          linkedinUrl: "/in/marcus-johnson-growth",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "DataStream Analytics",
      industry: "Data Analytics",
      size: "28-35 employees",
      location: "San Francisco, CA",
      contacts: [
        {
          name: "Priya Sharma",
          title: "Head of Marketing",
          email: "priya@datastream.ai",
          linkedinUrl: "/in/priya-sharma-analytics",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "FinTech Innovations NYC",
      industry: "Financial Technology",
      size: "75-100 employees",
      location: "New York, NY",
      contacts: [
        {
          name: "Andrew Martinez",
          title: "Director of Business Development",
          email: "andrew@fintechnyc.com",
          linkedinUrl: "/in/andrew-martinez-fintech",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Healthcare Companies - Multiple Cities
    {
      name: "MedTech Solutions Boston",
      industry: "Healthcare Technology",
      size: "40-55 employees",
      location: "Boston, MA",
      contacts: [
        {
          name: "Dr. Emily Chen",
          title: "Chief Innovation Officer",
          email: "emily@medtechboston.com",
          linkedinUrl: "/in/dr-emily-chen-medtech",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Chicago Health Systems",
      industry: "Healthcare Technology",
      size: "60-80 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Michael Rodriguez",
          title: "VP of Strategy",
          email: "michael@chicagohealth.com",
          linkedinUrl: "/in/michael-rodriguez-health",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Miami Medical Marketing",
      industry: "Healthcare Marketing",
      size: "22-30 employees",
      location: "Miami, FL",
      contacts: [
        {
          name: "Sofia Gonzalez",
          title: "Creative Director",
          email: "sofia@miamimedical.com",
          linkedinUrl: "/in/sofia-gonzalez-medical",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Finance & Investment - Multiple Cities
    {
      name: "Capital Growth Partners",
      industry: "Investment Management",
      size: "35-45 employees",
      location: "New York, NY",
      contacts: [
        {
          name: "Robert Kim",
          title: "Portfolio Manager",
          email: "robert@capitalgrowth.com",
          linkedinUrl: "/in/robert-kim-finance",
          avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Seattle Investment Group",
      industry: "Financial Services",
      size: "50-65 employees",
      location: "Seattle, WA",
      contacts: [
        {
          name: "Jennifer Wang",
          title: "Chief Marketing Officer",
          email: "jennifer@seattleinvest.com",
          linkedinUrl: "/in/jennifer-wang-investments",
          avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Entertainment & Media - Los Angeles Focus
    {
      name: "Sunset Media Productions",
      industry: "Media Production",
      size: "42-55 employees",
      location: "Los Angeles, CA",
      contacts: [
        {
          name: "Ryan Thompson",
          title: "Executive Producer",
          email: "ryan@sunsetmedia.com",
          linkedinUrl: "/in/ryan-thompson-media",
          avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Hollywood Digital Agency",
      industry: "Digital Marketing",
      size: "30-40 employees",
      location: "Los Angeles, CA",
      contacts: [
        {
          name: "Maria Santos",
          title: "Digital Strategy Lead",
          email: "maria@hollywooddigital.com",
          linkedinUrl: "/in/maria-santos-digital",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Real Estate - Multiple Cities
    {
      name: "Denver Property Group",
      industry: "Real Estate",
      size: "25-35 employees",
      location: "Denver, CO",
      contacts: [
        {
          name: "Kevin Brown",
          title: "Managing Broker",
          email: "kevin@denverproperties.com",
          linkedinUrl: "/in/kevin-brown-realestate",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Phoenix Realty Solutions",
      industry: "Real Estate Marketing",
      size: "18-25 employees",  
      location: "Phoenix, AZ",
      contacts: [
        {
          name: "Lisa Davis",
          title: "Marketing Director",
          email: "lisa@phoenixrealty.com",
          linkedinUrl: "/in/lisa-davis-realty",
          avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Outdoor Recreation - Denver/Seattle Focus
    {
      name: "Rocky Mountain Adventures",
      industry: "Outdoor Recreation",
      size: "15-22 employees",
      location: "Denver, CO",
      contacts: [
        {
          name: "Jake Wilson",
          title: "Adventure Director",
          email: "jake@rockymountain.com",
          linkedinUrl: "/in/jake-wilson-outdoor",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Pacific Northwest Gear",
      industry: "Outdoor Equipment",
      size: "38-50 employees",
      location: "Seattle, WA", 
      contacts: [
        {
          name: "Amanda Foster",
          title: "Brand Manager",
          email: "amanda@pnwgear.com",
          linkedinUrl: "/in/amanda-foster-outdoor",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    
    // Additional Marketing Agencies - All Cities
    {
      name: "Digital Dynamics Austin",
      industry: "Digital Marketing",
      size: "32-45 employees",
      location: "Austin, TX",
      contacts: [
        {
          name: "Carlos Mendez",
          title: "Creative Director",
          email: "carlos@digitaldynamics.com",
          linkedinUrl: "/in/carlos-mendez-creative",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Chicago Creative Collective",
      industry: "Creative Agency",
      size: "28-38 employees",
      location: "Chicago, IL",
      contacts: [
        {
          name: "Taylor Johnson",
          title: "Account Director",
          email: "taylor@chicagocreative.com",
          linkedinUrl: "/in/taylor-johnson-creative",
          avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
        }
      ]
    },
    {
      name: "Boston Brand Studio",
      industry: "Brand Strategy",
      size: "20-28 employees",
      location: "Boston, MA",
      contacts: [
        {
          name: "Alex Patterson",
          title: "Brand Strategist",
          email: "alex@bostonbrand.com",
          linkedinUrl: "/in/alex-patterson-brand",
          avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
        }
      ]
    }
  ];

  // Filter companies based on ICP keywords and return more results
  const filteredCompanies = filterCompaniesByICP(allCompanies, icp);
  
  // Return more companies to generate larger lead pools (up to 50 companies instead of limiting)
  return filteredCompanies.slice(0, Math.min(50, filteredCompanies.length));
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
  
  // Healthcare-related keywords
  if (icp.includes('healthcare') || icp.includes('health') || icp.includes('medical') || icp.includes('medtech')) {
    return companyIndustry.includes('healthcare') || companyIndustry.includes('health') || companyIndustry.includes('medical') || companyIndustry.includes('biotech');
  }
  
  // Finance-related keywords  
  if (icp.includes('finance') || icp.includes('financial') || icp.includes('investment') || icp.includes('fintech')) {
    return companyIndustry.includes('financial') || companyIndustry.includes('investment') || companyIndustry.includes('fintech');
  }
  
  // Real estate keywords
  if (icp.includes('real estate') || icp.includes('realty') || icp.includes('property')) {
    return companyIndustry.includes('real estate') || companyIndustry.includes('property');
  }
  
  // Entertainment/Media keywords
  if (icp.includes('entertainment') || icp.includes('media') || icp.includes('production')) {
    return companyIndustry.includes('entertainment') || companyIndustry.includes('media') || companyIndustry.includes('production');
  }
  
  // Outdoor recreation keywords
  if (icp.includes('outdoor') || icp.includes('recreation') || icp.includes('adventure')) {
    return companyIndustry.includes('outdoor') || companyIndustry.includes('recreation') || companyIndustry.includes('adventure');
  }
  
  return false;
}

function hasIndustryKeywords(icp: string): boolean {
  const industryKeywords = [
    'marketing', 'agency', 'advertising', 'dental', 'dentist', 'orthodont',
    'consulting', 'consultant', 'tech', 'software', 'startup', 'law', 'legal', 'attorney',
    'healthcare', 'health', 'medical', 'medtech', 'biotech',
    'finance', 'financial', 'investment', 'fintech',
    'real estate', 'realty', 'property',
    'entertainment', 'media', 'production',
    'outdoor', 'recreation', 'adventure'
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
        status: "ready",
        companySize: company.size,
        industry: company.industry,
        location: company.location,
        matchScore: 0, // Will be calculated by ranking system
        matchReason: ""
      });
    });
  });

  return leads;
}
