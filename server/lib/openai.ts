import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "your-api-key-here"
});

export interface EmailGenerationRequest {
  leadName: string;
  leadTitle: string;
  leadCompany: string;
  icp: string;
}

export interface GeneratedEmail {
  subject: string;
  content: string;
}

export async function generatePersonalizedEmail(request: EmailGenerationRequest): Promise<GeneratedEmail> {
  try {
    const prompt = `You are an expert cold email writer. Generate a personalized cold outreach email for the following prospect:

Lead Information:
- Name: ${request.leadName}
- Title: ${request.leadTitle}
- Company: ${request.leadCompany}

Target ICP: ${request.icp}

Requirements:
1. Keep the email concise (under 150 words)
2. Make it highly personalized and relevant
3. Include a clear value proposition
4. End with a soft call-to-action
5. Use a professional but friendly tone
6. Don't be overly salesy

Return the response in JSON format with "subject" and "content" fields. The content should use proper line breaks with \\n\\n for paragraphs.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert cold email writer who creates highly personalized, effective outreach emails. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      subject: result.subject || "Quick question about your team",
      content: result.content || "Hi there,\n\nI'd love to connect with you about your current challenges.\n\nBest regards"
    };
  } catch (error) {
    console.error("Error generating email:", error);
    throw new Error("Failed to generate personalized email");
  }
}
