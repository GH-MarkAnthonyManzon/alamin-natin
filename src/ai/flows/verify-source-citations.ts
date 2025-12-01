'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying source citations in candidate profiles.
 *
 * It includes:
 * - verifySourceCitations - A function to verify source citations.
 * - VerifySourceCitationsInput - The input type for the verifySourceCitations function.
 * - VerifySourceCitationsOutput - The return type for the verifySourceCitations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifySourceCitationsInputSchema = z.object({
  citationText: z
    .string()
    .describe('The citation text to verify and find original sources for.'),
});
export type VerifySourceCitationsInput = z.infer<
  typeof VerifySourceCitationsInputSchema
>;

const VerifySourceCitationsOutputSchema = z.object({
  originalSources: z
    .array(z.string().url())
    .describe('A list of URL strings pointing to original sources found for the citation text.'),
});
export type VerifySourceCitationsOutput = z.infer<
  typeof VerifySourceCitationsOutputSchema
>;

export async function verifySourceCitations(
  input: VerifySourceCitationsInput
): Promise<VerifySourceCitationsOutput> {
  return verifySourceCitationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifySourceCitationsPrompt',
  input: {schema: VerifySourceCitationsInputSchema},
  output: {schema: VerifySourceCitationsOutputSchema},
  prompt: `You are an AI assistant that ONLY returns URLs.

  Given the following citation text, find a list of original source URLs.
  Return ONLY a list of URL strings. Do not include any other text, explanations, or formatting.

  Citation Text: {{{citationText}}}
  `,
});

const verifySourceCitationsFlow = ai.defineFlow(
  {
    name: 'verifySourceCitationsFlow',
    inputSchema: VerifySourceCitationsInputSchema,
    outputSchema: VerifySourceCitationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
