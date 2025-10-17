import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use(
  "/api/trpc/*",
  trpcServer({
    router: appRouter,
    createContext,
    responseMeta() {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
      };
    },
    onError({ error, type, path, input, ctx, req }) {
      console.error('❌ tRPC Error:', {
        type,
        path,
        message: error.message,
        code: error.code,
      });
    },
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/api", (c) => {
  return c.json({ status: "ok", message: "API endpoint" });
});

app.notFound((c) => {
  console.error('❌ 404 Not Found:', c.req.url);
  return c.json({ error: "Not found" }, 404);
});

app.onError((err, c) => {
  console.error('❌ Server error:', err.message, err.stack);
  return c.json({ 
    error: err.message || 'Internal server error',
    path: c.req.url 
  }, 500);
});

export default app;
