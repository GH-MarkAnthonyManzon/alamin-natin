'use server';

/**
 * @fileOverview This file defines a Genkit flow for verifying source citations.
 *
 * It includes:
 * - verifySourceCitations - A function to verify source citations.
 * - VerifySourceCitationsInput - The input type for the verifySourceCitations function.
 * - VerifySourceCitationsOutput - The return type for the verifySourceCitations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { ragFlow } from './rag-flow';

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
  const sources = await ragFlow(input.citationText)
  
  return { originalSources: sources };
}
