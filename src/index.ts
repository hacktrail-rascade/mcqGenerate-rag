export interface Env {
  GEMINI_API_KEY: string;
}
import { Hono } from "hono";
import { home } from "./routes/home";
import { getQuestions } from "./routes/questions";

const app = new Hono<{ Bindings: Env }>();

app.get("/", home);
app.post("/questions", getQuestions);

export default app;
