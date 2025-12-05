'use server';

/**
 * @fileOverview This file defines a function for verifying source citations.
 *
 * It includes:
 * - verifySourceCitations - A function to verify source citations.
 * - VerifySourceCitationsInput - The input type for the verifySourceCitations function.
 * - VerifySourceCitationsOutput - The return type for the verifySourceCitations function.
 */

import { ragFlow } from './rag-flow';
import { Document } from '@langchain/core/documents';
import { z } from 'zod';

const VerifySourceCitationsInputSchema = z.object({
  citationText: z
    .string()
    .min(1, 'Citation text is required')
    .describe('The citation text to verify and find original sources for.'),
  sourceUrl: z.string().url('Please provide a valid URL').describe('The URL of the source to verify against.'),
});

export type VerifySourceCitationsInput = z.infer<
  typeof VerifySourceCitationsInputSchema
>;

const VerifySourceCitationsOutputSchema = z.object({
  originalSources: z
    .array(z.string())
    .describe(
      'A list of URL strings where the citation text was actually found.'
    ),
    fullContent: z.string().optional().describe('Full content for AI analysis'), //added fullContent
});

export type VerifySourceCitationsOutput = z.infer<
  typeof VerifySourceCitationsOutputSchema
>;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function tokenize(text: string): string[] {
  return text.toLowerCase().match(/\b[\w'-]+\b/g) ?? [];
}

function computeMatchScore(docText: string, citationText: string): number {
  const citationWords = tokenize(citationText).filter(word => word.length > 3);
  if (citationWords.length === 0) {
    return 0;
  }

  const docWords = new Set(tokenize(docText));
  const overlap = citationWords.filter(word => docWords.has(word)).length;
  return overlap / citationWords.length;
}

function extractSnippet(docText: string, citationText: string): string {
  const normalizedDoc = normalize(docText);
  const normalizedCitation = normalize(citationText);
  const directIndex = normalizedDoc.indexOf(normalizedCitation);

  if (directIndex !== -1) {
    const start = Math.max(0, directIndex - 100);
    const end = Math.min(
      normalizedDoc.length,
      directIndex + normalizedCitation.length + 100
    );
    return docText.substring(start, end).trim();
  }

  // Fallback: take the first 200 chars from the doc text
  return docText.substring(0, 200).trim();
}

export async function verifySourceCitations(
  input: VerifySourceCitationsInput
): Promise<VerifySourceCitationsOutput> {
  const { citationText, sourceUrl } = input;
  
  try {
    console.log('Starting verification for:', sourceUrl);
    // Pass skipAnswer=true to skip slow answer generation (biggest speedup!)
    const result = await ragFlow(citationText, sourceUrl, true);
    console.log('RAG flow completed, context length:', result?.context?.length);

    if (result && result.context && result.context.length > 0) {
      const normalizedCitation = normalize(citationText);
      const MATCH_THRESHOLD = 0.6; // 60% word overlap

      const matchedSources = result.context
        .map((doc: Document) => {
          const docText = doc.pageContent || '';
          const normalizedDoc = normalize(docText);

          const directMatch =
            normalizedCitation.length > 0
              ? normalizedDoc.includes(normalizedCitation)
              : false;

          const score = directMatch
            ? 1
            : computeMatchScore(docText, citationText);

          if (score < MATCH_THRESHOLD && !directMatch) {
            return null;
          }

          const source =
            (doc.metadata?.source as string) ||
            (doc.metadata?.url as string) ||
            sourceUrl;

          if (!source) {
            return null;
          }

          return {
            source,
            score,
            snippet: extractSnippet(docText, citationText),
          };
        })
        .filter(
          (
            match
          ): match is { source: string; score: number; snippet: string } =>
            Boolean(match)
        );

      if (matchedSources.length > 0) {
        const uniqueSources = Array.from(
          new Map(matchedSources.map(match => [match.source, match])).values()
        ).map(match => match.source);

        console.log('Verified sources:', uniqueSources);
        return { 
          originalSources: uniqueSources, 
          fullContent: result.fullContent, //added fullContent
        };
      }
    }

    console.log('No matching content found, returning empty sources');
    return { 
      originalSources: [], 
      fullContent: result?.fullContent, //added fullContent
    };
  } catch (error) {
    console.error('Error in verifySourceCitations:', error);
    throw error;
  }
}
