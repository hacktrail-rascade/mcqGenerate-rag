import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { Context } from "hono";

export const getRetriever = (c: Context) => {
  const sbUrl = c.env.SB_URL;
  const sbApiKey = c.env.SB_API_KEY;
  const openAIApiKey = c.env.OPENAI_KEY;

  if (!sbUrl || !sbApiKey)
    throw new Error("Supabase URL or API key not configured");

  const client = createClient(sbUrl, sbApiKey);
  const embeddings = new OpenAIEmbeddings({ openAIApiKey });

  const vectorstore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  return vectorstore.asRetriever();
};
