'use server';
import { Document } from '@langchain/core/documents';
import { HNSWLib } from '@langchain/community/vectorstores/hnswlib';
import { anyscale, gemini, googleAI } from 'genkit/x/langchain';
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
import { YoutubeLoader } from 'langchain/document_loaders/web/youtube';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { JSONLoader } from 'langchain/document_loaders/fs/json';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
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

export async function ragFlow(question: string) {
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

  return result;
}
