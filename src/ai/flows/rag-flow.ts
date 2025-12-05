'use server';
import { Document } from '@langchain/core/documents';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from '@langchain/google-genai';
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables';
import { formatDocumentsAsString } from 'langchain/util/document';
import { StringOutputParser } from '@langchain/core/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

// Cache directory for storing fetched documents
const CACHE_DIR = join(process.cwd(), '.cache', 'documents');

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Generate cache key from URL
function getCacheKey(url: string): string {
  return createHash('md5').update(url).digest('hex');
}

// Check if cached document exists and is fresh (24 hours)
async function getCachedDocument(url: string): Promise<Document[] | null> {
  try {
    await ensureCacheDir();
    const cacheKey = getCacheKey(url);
    const cachePath = join(CACHE_DIR, `${cacheKey}.json`);
    
    const stats = await fs.stat(cachePath).catch(() => null);
    if (!stats) return null;
    
    // Check if cache is fresh (24 hours)
    const age = Date.now() - stats.mtimeMs;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    if (age > maxAge) {
      await fs.unlink(cachePath).catch(() => {});
      return null;
    }
    
    const cached = await fs.readFile(cachePath, 'utf-8');
    const data = JSON.parse(cached);
    return data.docs.map((d: any) => new Document({
      pageContent: d.pageContent,
      metadata: d.metadata,
    }));
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
}

// Save document to cache
async function saveCachedDocument(url: string, docs: Document[]) {
  try {
    await ensureCacheDir();
    const cacheKey = getCacheKey(url);
    const cachePath = join(CACHE_DIR, `${cacheKey}.json`);
    
    const data = {
      url,
      cachedAt: Date.now(),
      docs: docs.map(doc => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata,
      })),
    };
    
    await fs.writeFile(cachePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    console.warn('Cache write error:', error);
    // Don't throw - caching is optional
  }
}

async function loadWebDocument(url: string): Promise<Document[]> {
  try {
    // Try cache first
    const cached = await getCachedDocument(url);
    if (cached) {
      console.log('Using cached document for:', url);
      return cached;
    }
    
    console.log('Loading web document from:', url);
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();
    console.log('Loaded', docs.length, 'documents');
    
    // Process and cache documents
    const processedDocs = docs.map((doc: Document) => new Document({
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        source: url, // Explicitly set source URL
      },
    }));
    
    // Save to cache (don't await - fire and forget for speed)
    saveCachedDocument(url, processedDocs).catch(() => {});
    
    return processedDocs;
  } catch (error) {
    console.error('Error loading web document:', error);
    throw error;
  }
}

export async function ragFlow(
  question: string, 
  sourceUrl: string,
  skipAnswer: boolean = false // Skip answer generation for speed (used in verification)
): Promise<{ answer: string; context: Document[]; fullContent?: string}> { //added fullContent
  try {
    console.log('Starting RAG flow for question:', question.substring(0, 50) + '...');
    const webDocs = await loadWebDocument(sourceUrl);

    // For verification, use fast text-based matching instead of slow semantic search
    // This avoids API calls and timeouts
    console.log('Using fast text-based matching for verification...');
    
    // Extract meaningful keywords from the question (words longer than 3 chars)
    const questionLower = question.toLowerCase();
    const questionWords = questionLower
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['that', 'this', 'with', 'from', 'have', 'been', 'were', 'which', 'their', 'there'].includes(word));
    
    console.log('Searching for keywords:', questionWords.slice(0, 5).join(', '));
    
    // Optimize: Only search first 5000 chars of each document for speed
    const scoredDocs = webDocs.map(doc => {
      const content = doc.pageContent.substring(0, 5000).toLowerCase();
      let score = 0;
      let matchedWords = 0;
      
      questionWords.forEach(word => {
        if (content.includes(word)) {
          score += 1;
          matchedWords += 1;
        }
      });
      
      // Bonus for matching multiple unique words
      const matchRatio = matchedWords / Math.max(questionWords.length, 1);
      score += matchRatio * 5;
      
      return { doc, score, matchedWords };
    });
    
    // Sort by score and take top matches
    scoredDocs.sort((a, b) => b.score - a.score);
    const context = scoredDocs
      .filter(item => item.score > 0 || item.matchedWords > 0)
      .slice(0, 5)
      .map(item => item.doc);
    
    console.log('Found', context.length, 'matching documents using text search');
    
    // If no matches found, return all documents as fallback (they all came from the source URL)
    if (context.length === 0) {
      console.log('No text matches found, returning all documents as fallback');
      context.push(...webDocs.slice(0, 5));
    }

    // Skip answer generation for verification (biggest speedup!)
    let answer = '';
    if (!skipAnswer && context.length > 0) {
      // Only generate answer if explicitly requested (not for verification)
      console.log('Generating answer...');
      try {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is not set in the environment.');
        }
        
        const prompt = ChatPromptTemplate.fromMessages([
          SystemMessagePromptTemplate.fromTemplate(
            `Answer the following question based only on the provided context:\n\n<context>\n{context}\n</context>`
          ),
          HumanMessagePromptTemplate.fromTemplate('Question: {question}'),
        ]);

        const model = new ChatGoogleGenerativeAI({
          apiKey: process.env.GEMINI_API_KEY,
          modelName: 'gemini-1.5-flash-latest',
        });
        
        const chain = RunnableSequence.from([
          {
            context: async () => {
              return formatDocumentsAsString(context);
            },
            question: new RunnablePassthrough(),
          },
          prompt,
          model,
          new StringOutputParser(),
        ]);

        answer = await chain.invoke(question);
        console.log('Answer generated, length:', answer.length);
      } catch (answerError) {
        console.warn('Answer generation failed, but continuing with context:', answerError);
        // Continue without answer - context is what we need for verification
      }
    } else if (skipAnswer) {
      console.log('Skipping answer generation for speed (verification mode)');
    }

    return {
      answer: answer,
      context: context,
      fullContent: webDocs.map(doc => doc.pageContent).join('\n\n').substring(0, 5000), // added fullContent
    };
  } catch (error) {
    console.error('Error in ragFlow:', error);
    throw error;
  }
}
