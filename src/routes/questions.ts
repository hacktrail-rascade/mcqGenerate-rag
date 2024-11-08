import { Context } from "hono";
import { getResponse } from "../utils/questions";

export const getQuestions = async (c: Context) => {
  try {
    const { videoID, question } = await c.req.json();

    if (!videoID || !question) {
      return c.json({ error: "No videoID or question provided." }, 400);
    }

    const answer = await getResponse(videoID, question, c);
    return c.json({ answer });
  } catch (error) {
    console.error(error);
    return c.json(
      { error: "An error occurred while processing the request." },
      500,
    );
  }
};
