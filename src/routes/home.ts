import { Context } from "hono";

export const home = (c: Context) => {
  return c.text("Hello Hono!");
};
