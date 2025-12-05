//src/ai/flows/analyze-verification.ts
//added 9:16 pm 12/5/25 ADDED THE WHOLE CODE

'use server';

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export interface VerificationAnalysis {
  summary: string;
  suggestion: string;
  disclaimer: string;
}

export async function analyzeVerificationResult(
  citationText: string,
  sourceUrl: string,
  foundSources: string[],
  contextSnippets?: string[]
): Promise<VerificationAnalysis> {
  try {
    console.log('🤖 Starting AI analysis...');
    const startTime = Date.now();
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const model = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      modelName: 'gemini-1.5-flash-latest',
      temperature: 0.3, // Lower temperature for faster, more consistent responses
      maxOutputTokens: 150, // Limit output for speed
    });

    const hasResults = foundSources.length > 0;
    
    // Shorter, more focused prompt for faster response
    const prompt = `Citation verification result for "Alamin Natin" platform:

Citation: "${citationText.substring(0, 150)}${citationText.length > 150 ? '...' : ''}"
Source: ${sourceUrl}
Found: ${hasResults ? 'YES' : 'NO'}
${contextSnippets?.[0] ? `Match: "${contextSnippets[0].substring(0, 100)}..."` : ''}

Provide brief JSON response:
{
  "summary": "One 15-word sentence on what was found",
  "suggestion": "One 15-word sentence on what to do next"
}

${hasResults ? 
  'If FOUND: confirm match, suggest reviewing full context.' : 
  'If NOT FOUND: suggest possible reasons (paraphrasing, wrong source), recommend checking other sources.'}`;

    const response = await model.invoke(prompt);
    console.log(`🤖 AI analysis completed in ${Date.now() - startTime}ms`);
    
    const content = response.content as string;
    
    // Fast JSON extraction
    let jsonText = content.trim();
    if (jsonText.includes('```')) {
      jsonText = jsonText.replace(/```(?:json)?\n?/g, '').trim();
    }
    
    const analysis = JSON.parse(jsonText);
    
    return {
      summary: analysis.summary || 'Verification complete.',
      suggestion: analysis.suggestion || 'Consider checking additional sources.',
      disclaimer: 'AI analysis may contain errors. Verify with primary sources.',
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    // Fast fallback (no AI needed)
    return {
      summary: foundSources.length > 0 
        ? 'The citation appears in the source with matching content.'
        : 'The citation was not found in the source document.',
      suggestion: foundSources.length > 0
        ? 'Review the source to verify the full context and accuracy.'
        : 'Try alternative sources or check for paraphrasing or updates.',
      disclaimer: 'AI analysis may contain errors. Verify with primary sources.',
    };
  }
}