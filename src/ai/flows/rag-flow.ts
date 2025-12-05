//added 9:18 pm 12/5/25 ADDED THE WHOLE CODE

'use server';
import { Document } from '@langchain/core/documents';
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const CACHE_DIR = join(process.cwd(), '.cache', 'documents');

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

function getCacheKey(url: string): string {
  return createHash('md5').update(url).digest('hex');
}

// Cache now stores for 7 days instead of 24 hours for better performance
async function getCachedDocument(url: string): Promise<Document[] | null> {
  try {
    await ensureCacheDir();
    const cacheKey = getCacheKey(url);
    const cachePath = join(CACHE_DIR, `${cacheKey}.json`);
    
    const stats = await fs.stat(cachePath).catch(() => null);
    if (!stats) return null;
    
    // Check if cache is fresh (7 days for better performance)
    const age = Date.now() - stats.mtimeMs;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
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
    return null;
  }
}

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
    // Ignore cache write errors
  }
}

async function loadWebDocument(url: string): Promise<Document[]> {
  // Try cache first
  const cached = await getCachedDocument(url);
  if (cached) {
    console.log('✓ Using cached document (instant)');
    return cached;
  }
  
  console.log('⚠ Cache miss - fetching with browser (slow)...');
  
  let browser;
  try {
    // Add timeout to browser operations
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security', // Faster loading
        '--disable-features=IsolateOrigins,site-per-process', // Faster
      ],
      timeout: 10000, // 10 second timeout for launch
    });
    
    const page = await browser.newPage();
    
    // Set shorter timeout and disable unnecessary resources for speed
    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      // Block images, fonts, media for speed - we only need text
      if (['image', 'font', 'media'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });
    
    // Navigate with strict timeout
    await page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 // 15 second max
    });
    
    // Extract text content quickly
    const content = await page.evaluate(() => {
      // Remove script and style elements
      const scripts = document.querySelectorAll('script, style, noscript');
      scripts.forEach(el => el.remove());
      
      // Try common content containers first (faster)
      const selectors = ['article', 'main', '[role="main"]', '.content', 'body'];
      
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el?.textContent && el.textContent.length > 100) {
          return el.textContent;
        }
      }
      
      return document.body.textContent || '';
    });
    
    await browser.close();
    
    const docs = [new Document({
      pageContent: content.trim(),
      metadata: { source: url },
    })];
    
    // Save to cache asynchronously (don't wait)
    saveCachedDocument(url, docs).catch(() => {});
    
    return docs;
  } catch (error) {
    if (browser) {
      await browser.close().catch(() => {});
    }
    console.error('Browser fetch error:', error);
    throw new Error(`Failed to load URL: ${url}. ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function ragFlow(
  question: string, 
  sourceUrl: string,
  skipAnswer: boolean = false
): Promise<{ answer: string; context: Document[] }> {
  try {
    console.log('Starting fast text matching...');
    const startTime = Date.now();
    
    const webDocs = await loadWebDocument(sourceUrl);
    console.log(`Document loaded in ${Date.now() - startTime}ms`);

    // ULTRA-FAST text matching (no AI, no embeddings)
    const questionLower = question.toLowerCase();
    const questionWords = questionLower
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !['that', 'this', 'with', 'from', 'have', 'been', 'were', 'which', 'their', 'there', 'said', 'says'].includes(word));
    
    console.log('Searching for keywords:', questionWords.slice(0, 5).join(', '));
    
    // Score documents by keyword matches
    const scoredDocs = webDocs.map(doc => {
      const content = doc.pageContent.toLowerCase();
      let score = 0;
      let matchedWords = 0;
      
      questionWords.forEach(word => {
        const count = (content.match(new RegExp(word, 'g')) || []).length;
        if (count > 0) {
          score += count;
          matchedWords += 1;
        }
      });
      
      // Bonus for matching multiple unique words
      const matchRatio = matchedWords / Math.max(questionWords.length, 1);
      score += matchRatio * 10;
      
      return { doc, score, matchedWords };
    });
    
    // Sort and filter
    scoredDocs.sort((a, b) => b.score - a.score);
    const context = scoredDocs
      .filter(item => item.score > 0)
      .slice(0, 3)
      .map(item => item.doc);
    
    console.log(`Found ${context.length} matches in ${Date.now() - startTime}ms`);
    
    // Return immediately - no AI answer generation for speed
    return {
      answer: '',
      context: context.length > 0 ? context : webDocs.slice(0, 1),
    };
  } catch (error) {
    console.error('Error in ragFlow:', error);
    throw error;
  }
}