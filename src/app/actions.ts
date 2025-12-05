'use server';

import { verifySourceCitations } from '@/ai/flows/verify-source-citations';
import { z } from 'zod';

const VerifyCitationSchema = z.object({
  citationText: z.string().min(10, 'Please enter more text to verify.'),
  sourceUrl: z.string().url('Please enter a valid URL.'),
});

type VerifyState = {
  sources?: string[];
  error?: string;
  message?: string;
};

export async function verifyCitationAction(
  prevState: VerifyState,
  formData: FormData
): Promise<VerifyState> {
  const validatedFields = VerifyCitationSchema.safeParse({
    citationText: formData.get('citationText'),
    sourceUrl: formData.get('sourceUrl'),
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
    console.log('result', result);
    if (result && result.originalSources.length > 0) {
      return {
        sources: result.originalSources,
        message: 'Sources found successfully.',
      };
    } else {
      return {
        sources: [],
        message: 'No original sources could be found for the provided text in the given URL.',
      };
    }
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred while verifying sources.' };
  }
}
