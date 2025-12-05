'use server';

import { verifySourceCitations } from '@/ai/flows/verify-source-citations';
import { analyzeSourceWithAI } from '@/ai/flows/analyze-source';
import { z } from 'zod';

const VerifyCitationSchema = z.object({
  citationText: z.string().min(10, 'Please enter more text to verify.'),
  sourceUrl: z.string().url('Please enter a valid URL.'),
  enableAIAnalysis: z.boolean().optional().default(false),
});

type VerifyState = {
  sources?: string[];
  error?: string;
  message?: string;
  aiAnalysis?: {
    sourceName: string;
    sourceType: string;
    mainTopic: string;
    observations: {
      language: string;
      writingStyle: string;
      contentType: string;
      hasAuthorship: boolean;
      hasCitations: boolean;
      hasContactInfo: boolean;
    };
    considerations: string[];
    suggestedVerificationSteps: string[];
  };
  aiAnalysisError?: string;
};

export async function verifyCitationAction(
  prevState: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  const validatedFields = VerifyCitationSchema.safeParse({
    citationText: formData.get('citationText'),
    sourceUrl: formData.get('sourceUrl'),
    enableAIAnalysis: formData.get('enableAIAnalysis') === 'true',
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage =
      fieldErrors.citationText?.[0] || fieldErrors.sourceUrl?.[0];
    return {
      error: 'Invalid input. ' + errorMessage,
    };
  }

  try {
    const result = await verifySourceCitations({
      citationText: validatedFields.data.citationText,
      sourceUrl: validatedFields.data.sourceUrl,
    });
    
    console.log('Verification result:', result);
    
    const baseResponse: VerifyState = {};

    // Add AI analysis if enabled and we have content
    if (validatedFields.data.enableAIAnalysis && result.fullContent) {
      try {
        console.log('Running AI analysis...');
        const aiAnalysis = await analyzeSourceWithAI({
          sourceUrl: validatedFields.data.sourceUrl,
          sourceContent: result.fullContent,
        });
        baseResponse.aiAnalysis = aiAnalysis;
      } catch (aiError) {
        console.error('AI analysis failed:', aiError);
        baseResponse.aiAnalysisError = 'AI analysis unavailable. This does not affect verification results.';
      }
    }
    
    if (result && result.originalSources.length > 0) {
      return {
        ...baseResponse,
        sources: result.originalSources,
        message: 'Citation verified in source.',
      };
    } else {
      return {
        ...baseResponse,
        sources: [],
        message: 'No matching content found for the provided citation in the given URL.',
      };
    }
  } catch (e) {
    console.error(e);
    return { 
      error: 'An unexpected error occurred while verifying the citation.' 
    };
  }
}