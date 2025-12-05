//added 9:17pm 12/5/25 ADDED THE WHOLE CODE

'use server';

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
    .describe('A list of URL strings where the citation text was actually found.'),
  contextSnippets: z
    .array(z.string())
    .optional()
    .describe('Snippets of text showing where the citation was found in the source'),
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

// Faster matching with lower threshold
function computeMatchScore(docText: string, citationText: string): number {
  const citationWords = tokenize(citationText).filter(word => word.length > 3);
  if (citationWords.length === 0) return 0;

  const docWords = new Set(tokenize(docText));
  const overlap = citationWords.filter(word => docWords.has(word)).length;
  return overlap / citationWords.length;
}

function extractSnippet(docText: string, citationText: string): string {
  const normalizedDoc = normalize(docText);
  const normalizedCitation = normalize(citationText);
  const directIndex = normalizedDoc.indexOf(normalizedCitation);

  if (directIndex !== -1) {
    const start = Math.max(0, directIndex - 50);
    const end = Math.min(normalizedDoc.length, directIndex + normalizedCitation.length + 50);
    return docText.substring(start, end).trim();
  }

  // Fallback: find first matching keyword context
  const keywords = tokenize(citationText).filter(w => w.length > 4);
  for (const keyword of keywords.slice(0, 3)) {
    const idx = normalizedDoc.indexOf(keyword);
    if (idx !== -1) {
      const start = Math.max(0, idx - 50);
      const end = Math.min(normalizedDoc.length, idx + 150);
      return docText.substring(start, end).trim();
    }
  }
  
  return docText.substring(0, 150).trim();
}

export async function verifySourceCitations(
  input: VerifySourceCitationsInput
): Promise<VerifySourceCitationsOutput> {
  const { citationText, sourceUrl } = input;
  
  try {
    console.log('⚡ Starting fast verification...');
    const startTime = Date.now();
    
    // Fast text-based matching (no AI)
    const result = await ragFlow(citationText, sourceUrl, true);
    console.log(`⚡ Verification completed in ${Date.now() - startTime}ms`);

    if (result?.context && result.context.length > 0) {
      const normalizedCitation = normalize(citationText);
      const MATCH_THRESHOLD = 0.4; // Lowered from 0.6 for faster matches

      const matchedSources = result.context
        .map((doc: Document) => {
          const docText = doc.pageContent || '';
          const normalizedDoc = normalize(docText);

          // Quick substring check first (fastest)
          const directMatch = normalizedDoc.includes(normalizedCitation);
          
          // If no direct match, check word overlap (still fast)
          const score = directMatch ? 1 : computeMatchScore(docText, citationText);

          if (score < MATCH_THRESHOLD && !directMatch) {
            return null;
          }

          const source = (doc.metadata?.source as string) || sourceUrl;
          return {
            source,
            score,
            snippet: extractSnippet(docText, citationText),
          };
        })
        .filter((match): match is { source: string; score: number; snippet: string } => 
          Boolean(match)
        );

      if (matchedSources.length > 0) {
        const uniqueSources = Array.from(
          new Map(matchedSources.map(match => [match.source, match])).values()
        );

        console.log('✓ Found', uniqueSources.length, 'matching sources');
        return { 
          originalSources: uniqueSources.map(m => m.source),
          contextSnippets: uniqueSources.map(m => m.snippet)
        };
      }
    }

    console.log('✗ No matching content found');
    return { originalSources: [], contextSnippets: [] };
  } catch (error) {
    console.error('Error in verifySourceCitations:', error);
    throw error;
  }
}