// src/ai/flows/analyze-source.ts
'use server';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';

const AnalyzeSourceInputSchema = z.object({
  sourceUrl: z.string().url('Please provide a valid URL'),
  sourceContent: z.string().min(100, 'Source content must be at least 100 characters'),
});

export type AnalyzeSourceInput = z.infer<typeof AnalyzeSourceInputSchema>;

const SourceAnalysisSchema = z.object({
  sourceName: z.string().describe('The name of the media outlet or website'),
  sourceType: z.string().describe('Type of source (e.g., News Outlet, Blog, Government Site, Academic, Social Media)'),
  mainTopic: z.string().describe('The main topic or focus of this source'),
  observations: z.object({
    language: z.string().describe('Primary language used'),
    writingStyle: z.string().describe('Writing style (e.g., formal, informal, academic, tabloid)'),
    contentType: z.string().describe('Type of content (news, opinion, analysis, personal blog, etc.)'),
    hasAuthorship: z.boolean().describe('Whether author information is clearly provided'),
    hasCitations: z.boolean().describe('Whether the content includes citations or references'),
    hasContactInfo: z.boolean().describe('Whether contact or about information is available'),
  }).describe('Observable characteristics of the source'),
  considerations: z.array(z.string()).describe('List of things users should consider when evaluating this source'),
  suggestedVerificationSteps: z.array(z.string()).describe('Specific steps to verify information from this source'),
});

export type SourceAnalysis = z.infer<typeof SourceAnalysisSchema>;

export async function analyzeSourceWithAI(
  input: AnalyzeSourceInput
): Promise<SourceAnalysis> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in the environment.');
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: 'gemini-1.5-flash-latest',
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    const prompt = `You are a media literacy assistant helping Filipino voters evaluate information sources. Analyze the following source and provide objective observations.

IMPORTANT GUIDELINES:
- DO NOT make definitive judgments about reliability, bias, or trustworthiness
- Focus on OBSERVABLE characteristics that users can verify themselves
- Provide educational guidance, not final verdicts
- Acknowledge that your analysis may be incomplete or incorrect
- Encourage users to verify information across multiple sources

Source URL: ${input.sourceUrl}

Source Content (excerpt):
${input.sourceContent.substring(0, 3000)}

Please analyze this source and provide:
1. Basic identification (name, type, main topic)
2. Observable characteristics (writing style, authorship, citations, etc.)
3. Considerations for users when evaluating this source
4. Specific steps users can take to verify information from this source

Format your response as JSON with this structure:
{
  "sourceName": "Name of the outlet/website",
  "sourceType": "Category of source",
  "mainTopic": "Primary focus/topic",
  "observations": {
    "language": "Primary language",
    "writingStyle": "Style description",
    "contentType": "Type of content",
    "hasAuthorship": true/false,
    "hasCitations": true/false,
    "hasContactInfo": true/false
  },
  "considerations": [
    "Things to consider when reading this source..."
  ],
  "suggestedVerificationSteps": [
    "Specific steps to verify information..."
  ]
}`;

    const response = await model.invoke(prompt);
    const content = response.content as string;
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = content.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
    }
    
    const analysis = JSON.parse(jsonText);
    
    // Validate against schema
    return SourceAnalysisSchema.parse(analysis);
  } catch (error) {
    console.error('Error analyzing source with AI:', error);
    throw new Error('Failed to analyze source. Please try again.');
  }
}