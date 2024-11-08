import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export async function vectorUpload(data: string, c: Context) {
  const sbUrl = c.env.SB_URL;
  const sbApiKey = c.env.SB_API_KEY;
  const openAIApiKey = c.env.OPENAI_KEY;

  if (!sbUrl || !sbApiKey)
    throw new Error("Supabase URL or API key not configured");

  const client = createClient(sbUrl, sbApiKey);
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const output = await splitter.createDocuments([data]);

  await SupabaseVectorStore.fromDocuments(output, embeddings, {
    client,
    tableName: "documents",
  });

  console.log("Data successfully stored in vector store.");
  return { success: true };
}
