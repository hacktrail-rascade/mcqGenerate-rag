import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { fetchTranscriptData } from "./helper/fetchTranscript";
import { Context } from "hono";

export async function getResponse(
  videoID: string,
  question: string,
  c: Context,
) {
  try {
    const openAIApiKey = c.env.OPENAI_KEY;
    const llm = new ChatOpenAI({
      openAIApiKey,
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const transcriptResponse = await fetchTranscriptData(videoID, c);
    // @ts-ignore
    const videoTranscript = transcriptResponse.transcript;

    const template = `
You are an API that sends JSON response. Imagine you are also a teacher and you are preparing a set of MCQs with a minimum of 10 questions and a maximum of 15 questions.
Each question should have an ID, question text, and options as an array of objects where each option has a key "option" and a value representing the choice.
Please ensure to include at max 3 HARD questions and rest mostly keep EASY and MEDIUM. Return the questions and options in the following JSON format without any additional text:
{
  "questions": [
    {
      "id": 1,
      "question": "Your question here",
      "options": [
        {"option": "Option A"},
        {"option": "Option B"},
        {"option": "Option C"},
        {"option": "Option D"}
      ],
      "answer": "Correct option text",
      "difficulty": "question difficulty here EASY | MEDIUM | HARD"
    }
  ]
}

Use the following transcript as context to generate questions:
${videoTranscript}`;

    const messages = [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: template },
    ];

    const response = await llm.call(messages);

    try {
      // @ts-ignore
      const jsonResponse = JSON.parse(response.content);
      return jsonResponse;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid JSON response from AI model");
    }
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response.");
  }
}
