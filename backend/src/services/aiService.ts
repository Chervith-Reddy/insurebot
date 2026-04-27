import axios from 'axios';
import { AIClassificationResult, ClaimType, IncidentType } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export class AIService {
  private static readonly incidentToClaimTypeMap: Record<IncidentType, ClaimType> = {
    'Car Accident': 'accident',
    'Health Issue': 'health',
    'Property Damage': 'property',
    'Vehicle Theft': 'vehicle',
    'Natural Disaster': 'property',
    'Other': 'unknown',
  };

  private static classifyWithFallback(incidentType: IncidentType): AIClassificationResult {
    const claimType = AIService.incidentToClaimTypeMap[incidentType] || 'unknown';
    return {
      claimType,
      confidence: 0.85,
      reasoning: `Classified based on incident type: ${incidentType}`,
    };
  }

  private static buildPrompt(incidentType: IncidentType, description: string): string {
    return `You are an insurance claims classifier. Analyze the following insurance claim and classify it.

Incident Type: ${incidentType}
Description: ${description}

Classify this claim into exactly one of these categories:
- "accident": For car accidents, collisions, traffic incidents
- "health": For medical issues, health emergencies, hospital visits
- "property": For property damage, home damage, natural disasters, fire
- "vehicle": For vehicle theft, vandalism to vehicles
- "unknown": If cannot be determined

Respond with a JSON object only, no other text:
{
  "claimType": "<one of the categories above>",
  "confidence": <number between 0 and 1>,
  "reasoning": "<brief one sentence explanation>"
}`;
  }

  static async classifyClaim(
    incidentType: IncidentType,
    description: string
  ): Promise<AIClassificationResult> {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      console.warn('Groq API key not configured. Using fallback classification.');
      return AIService.classifyWithFallback(incidentType);
    }

    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are an insurance claims AI assistant. Always respond with valid JSON only.',
            },
            {
              role: 'user',
              content: AIService.buildPrompt(incidentType, description),
            },
          ],
          temperature: 0.1,
          max_tokens: 200,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        }
      );

      const content = response.data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from Groq');
      }

      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedContent) as AIClassificationResult;

      const validTypes: ClaimType[] = ['accident', 'health', 'property', 'vehicle', 'unknown'];
      if (!validTypes.includes(parsed.claimType)) {
        parsed.claimType = 'unknown';
      }

      return parsed;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Groq API error:', error.response?.data || error.message);
      } else {
        console.error('Classification error:', error);
      }
      console.warn('Falling back to rule-based classification');
      return AIService.classifyWithFallback(incidentType);
    }
  }
}
