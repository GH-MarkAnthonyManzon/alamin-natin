'use server';
import { Document } from '@langchain/core/documents';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
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
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: 'gemini-pro',
  maxOutputTokens: 2048,
});

async function loadWebDocument(url: string) {
  const loader = new CheerioWebBaseLoader(url);
  const docs = await loader.load();
  return docs;
}

export async function ragFlow(question: string): Promise<string[]> {
  const webDocs = await loadWebDocument(
    'https://www.rappler.com/philippines/elections/list-senatorial-candidates-approved-comelec-2025/'
  );

  const vectorStore = await HNSWLib.fromDocuments(
    webDocs,
    new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GEMINI_API_KEY })
  );
  const retriever = vectorStore.asRetriever();

  const relevantDocs = await retriever.getRelevantDocuments(question);
  
  if (relevantDocs && relevantDocs.length > 0) {
    // Return the source URLs from the metadata of the retrieved documents.
    // Using a Set to ensure we only return unique URLs.
    const sources = new Set(relevantDocs.map(doc => doc.metadata.source));
    return Array.from(sources);
  }

  return [];
}
