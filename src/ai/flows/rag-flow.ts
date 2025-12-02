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

  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      'Answer the question based only on the following context:\n{context}'
    ),
    HumanMessagePromptTemplate.fromTemplate('{question}'),
  ]);

  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);

  const result = await chain.invoke(question);

  // For now, we are not getting documents back.
  // This is a placeholder for where we would extract source URLs.
  // Since the result is just a string, we will return an empty array if it's not a URL.
  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch (_) {
      return false;
    }
  }

  if (result && isUrl(result)) {
    return [result];
  }

  // A more robust implementation would be to return the source documents from the retriever.
  // For now, let's return a hardcoded link if no URL is found in the direct response.
  const relevantDocs = await retriever.getRelevantDocuments(question);
  if (relevantDocs && relevantDocs.length > 0) {
    return relevantDocs.map(doc => doc.metadata.source).filter((source, index, self) => self.indexOf(source) === index);
  }

  return [];
}