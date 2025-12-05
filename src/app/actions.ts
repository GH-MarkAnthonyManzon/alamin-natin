//addded 9:13 pm 12/5/25 ADDED THE WHOLE CODE

'use server';

import { verifySourceCitations } from '@/ai/flows/verify-source-citations';
import { analyzeVerificationResult } from '@/ai/flows/analyze-verification';
import { z } from 'zod';

const VerifyCitationSchema = z.object({
  citationText: z.string().min(10, 'Please enter more text to verify.'),
  sourceUrl: z.string().url('Please enter a valid URL.'),
});

type VerifyState = {
  sources?: string[];
  contextSnippets?: string[];
  aiAnalysis?: {
    summary: string;
    suggestion: string;
    disclaimer: string;
  };
  error?: string;
  message?: string;
};

export async function verifyCitationAction(
  prevState: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  console.log('⚡ Verification started...');
  const overallStart = Date.now();
  
  const validatedFields = VerifyCitationSchema.safeParse({
    citationText: formData.get('citationText'),
    sourceUrl: formData.get('sourceUrl'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const errorMessage = fieldErrors.citationText?.[0] || fieldErrors.sourceUrl?.[0];
    return {
      error: 'Invalid input. ' + errorMessage,
    };
  }

  try {
    // Step 1: Fast verification (1-3 seconds with cache, 10-15 seconds without)
    const verifyStart = Date.now();
    const result = await verifySourceCitations({
      citationText: validatedFields.data.citationText,
      sourceUrl: validatedFields.data.sourceUrl,
    });
    console.log(`⚡ Verification: ${Date.now() - verifyStart}ms`);
    
    // Step 2: Quick AI analysis (1-3 seconds) - run AFTER verification to show results faster
    const analysisStart = Date.now();
    const aiAnalysis = await analyzeVerificationResult(
      validatedFields.data.citationText,
      validatedFields.data.sourceUrl,
      result.originalSources,
      result.contextSnippets
    );
    console.log(`⚡ AI Analysis: ${Date.now() - analysisStart}ms`);
    console.log(`⚡ Total time: ${Date.now() - overallStart}ms`);
    
    if (result?.originalSources.length > 0) {
      return {
        sources: result.originalSources,
        contextSnippets: result.contextSnippets,
        aiAnalysis,
        message: 'Citation verified successfully.',
      };
    } else {
      return {
        sources: [],
        contextSnippets: [],
        aiAnalysis,
        message: 'Citation not found in the provided source.',
      };
    }
  } catch (e) {
    console.error('❌ Verification error:', e);
    return { 
      error: e instanceof Error && e.message.includes('Failed to load URL')
        ? 'Could not access the URL. Please check if it\'s publicly accessible.'
        : 'An error occurred during verification. Please try again.' 
    };
  }
}