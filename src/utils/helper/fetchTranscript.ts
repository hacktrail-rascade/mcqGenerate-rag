import { Context } from "hono";

export async function fetchTranscriptData(videoID: string, c: Context) {
  const transcriptApiUrl = `${c.env.TRANSCRIPT_API_URL}/transcribe/${videoID}`;

  const response = await fetch(transcriptApiUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch transcript");
  }
  return await response.json();
}
