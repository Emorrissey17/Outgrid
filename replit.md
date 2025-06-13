# AI-Powered CRM Project

## Overview
Building an AI-powered mini CRM system that intelligently discovers and ranks leads based on specific criteria. The system finds ALL relevant prospects and ranks them by match quality, showing better matches first while still displaying less perfect matches for consideration.

## User Vision
- **Real Data Integration**: User wants to use real internet data for lead discovery in the near future
- **AI-Powered Analysis**: AI should make real informed descriptions and conclusions about potential clients/leads
- **Intelligent Ranking**: System should analyze criteria and rank all prospects by match quality
- **Comprehensive Profiles**: Display detailed company information including size, industry, location

## Architecture
- **Frontend**: React with TypeScript, shadcn/ui components, TailwindCSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: OpenAI API for email generation (requires user API key)

## Technical Stack
- Client/Server separation with Vite serving frontend
- Database storage with proper schema design
- AI-powered lead analysis and ranking system
- Email review functionality with editing and selection

## Recent Changes
- **2025-06-13**: Migrated from Replit Agent to standard environment
- **2025-06-13**: Implemented PostgreSQL database integration
- **2025-06-13**: Enhanced system with AI-powered lead ranking and match scoring
- **2025-06-13**: Added comprehensive lead profiles with company details
- **2025-06-13**: Fixed infinite loop rendering issues in email review
- **2025-06-13**: Implemented two-tier filtering system (hard filters + ICP ranking)
- **2025-06-13**: Added detailed client research functionality with "Show Details" button
- **2025-06-13**: Completed comprehensive leads management table with pagination, notes, starring, and detailed views

## User Preferences
- Focus on real data integration over mock data
- Prioritize AI-powered analysis capabilities
- Maintain comprehensive lead profiling system
- **Two-Tier Filtering System**: Hard filters (strict requirements) + ICP description (ranking criteria)
- **Detailed Client Research**: "Show Details" button for in-depth prospect analysis
- **Separate Leads Management**: Remove duplicate information, dedicated page for all leads
- **Complete Lead Data**: All leads must show location, size, match scores - mark as "Unknown" if missing
- **Enhanced Filtering**: Filter and sort leads by location, size, match score, industry
- **Diverse Lead Generation**: Support multiple cities and business types beyond Austin marketing
- **Recent Leads Page**: Dedicated page showing most recent leads with full details including data, match %, employees