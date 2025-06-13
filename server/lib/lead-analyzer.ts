import { type InsertLead } from "@shared/schema";

export interface LeadCriteria {
  industry?: string;
  location?: string;
  employeeRange?: {
    min: number;
    max: number;
  };
  keywords?: string[];
}

export interface ScoredLead extends Omit<InsertLead, 'campaignId'> {
  matchScore: number;
  matchReason: string;
}

export function parseICP(icp: string): LeadCriteria {
  const criteria: LeadCriteria = {};
  const lowerIcp = icp.toLowerCase();
  
  // Extract industry keywords
  const industryKeywords = [
    'marketing', 'agency', 'agencies', 'consulting', 'software', 'tech', 'technology',
    'healthcare', 'finance', 'real estate', 'construction', 'education', 'retail',
    'manufacturing', 'logistics', 'restaurant', 'hospitality', 'legal', 'accounting'
  ];
  
  criteria.industry = industryKeywords.find(keyword => lowerIcp.includes(keyword));
  
  // Extract location
  const locationPattern = /(?:in|near|around)\s+([a-zA-Z\s]+?)(?:\s|$|,|with|having)/;
  const locationMatch = lowerIcp.match(locationPattern);
  if (locationMatch) {
    criteria.location = locationMatch[1].trim();
  }
  
  // Extract employee range
  const employeePatterns = [
    /(\d+)-(\d+)\s*employees?/,
    /(\d+)\s*to\s*(\d+)\s*employees?/,
    /between\s*(\d+)\s*and\s*(\d+)\s*employees?/,
  ];
  
  for (const pattern of employeePatterns) {
    const match = lowerIcp.match(pattern);
    if (match) {
      criteria.employeeRange = {
        min: parseInt(match[1]),
        max: parseInt(match[2])
      };
      break;
    }
  }
  
  // Extract general keywords
  criteria.keywords = lowerIcp.split(/\s+/).filter(word => 
    word.length > 3 && 
    !['with', 'having', 'employees', 'employee', 'companies', 'company'].includes(word)
  );
  
  return criteria;
}

export function scoreLeadMatch(lead: any, criteria: LeadCriteria): { score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];
  
  // Industry match (40% weight)
  if (criteria.industry && lead.industry) {
    const industryMatch = lead.industry.toLowerCase().includes(criteria.industry.toLowerCase());
    if (industryMatch) {
      score += 40;
      reasons.push(`${lead.industry} matches target industry`);
    } else {
      score += 10; // Partial credit for having industry data
      reasons.push(`Different industry: ${lead.industry}`);
    }
  }
  
  // Location match (25% weight)
  if (criteria.location && lead.location) {
    const locationMatch = lead.location.toLowerCase().includes(criteria.location.toLowerCase());
    if (locationMatch) {
      score += 25;
      reasons.push(`Located in ${lead.location}`);
    } else {
      score += 5; // Partial credit for location data
      reasons.push(`Different location: ${lead.location}`);
    }
  }
  
  // Employee range match (30% weight)
  if (criteria.employeeRange && lead.companySize) {
    const employeeCount = extractEmployeeCount(lead.companySize);
    if (employeeCount !== null) {
      const { min, max } = criteria.employeeRange;
      
      if (employeeCount >= min && employeeCount <= max) {
        score += 30;
        reasons.push(`Perfect size fit: ${employeeCount} employees (target: ${min}-${max})`);
      } else {
        // Calculate distance from ideal range
        const distance = employeeCount < min ? 
          min - employeeCount : 
          employeeCount - max;
        
        const proximityScore = Math.max(0, 30 - (distance / max) * 20);
        score += proximityScore;
        
        if (employeeCount < min) {
          reasons.push(`Smaller than ideal: ${employeeCount} employees (target: ${min}-${max})`);
        } else {
          reasons.push(`Larger than ideal: ${employeeCount} employees (target: ${min}-${max})`);
        }
      }
    }
  }
  
  // Keyword relevance (5% weight)
  if (criteria.keywords) {
    const leadText = `${lead.company} ${lead.industry} ${lead.title}`.toLowerCase();
    const matchingKeywords = criteria.keywords.filter(keyword => 
      leadText.includes(keyword.toLowerCase())
    );
    
    if (matchingKeywords.length > 0) {
      score += Math.min(5, matchingKeywords.length * 2);
      reasons.push(`Relevant keywords: ${matchingKeywords.join(', ')}`);
    }
  }
  
  return {
    score: Math.round(Math.min(100, score)),
    reason: reasons.join(' • ')
  };
}

function extractEmployeeCount(sizeText: string): number | null {
  // Parse employee count from various formats
  const patterns = [
    /(\d+)\s*employees?/,
    /(\d+)-(\d+)\s*employees?/,
    /(\d+)\s*to\s*(\d+)/,
    /(\d+)\+/
  ];
  
  for (const pattern of patterns) {
    const match = sizeText.match(pattern);
    if (match) {
      if (match[2]) {
        // Range: take middle value
        return Math.round((parseInt(match[1]) + parseInt(match[2])) / 2);
      } else {
        return parseInt(match[1]);
      }
    }
  }
  
  return null;
}

export function rankLeads(leads: any[], criteria: LeadCriteria): ScoredLead[] {
  return leads
    .map(lead => {
      const { score, reason } = scoreLeadMatch(lead, criteria);
      return {
        ...lead,
        matchScore: score,
        matchReason: reason
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}