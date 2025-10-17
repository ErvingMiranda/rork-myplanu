import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

const app = new Hono();

console.log('🚀 Hono server starting...');

app.use("*", cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', async (c, next) => {
  console.log(`📥 ${c.req.method} ${c.req.url}`);
  await next();
});

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
  console.log('✅ Root endpoint hit');
  return c.json({ status: "ok", message: "API is running" });
});

app.get("/api", (c) => {
  console.log('✅ /api endpoint hit');
  return c.json({ status: "ok", message: "API endpoint" });
});

app.get("/api/trpc", (c) => {
  console.log('✅ /api/trpc endpoint hit (GET)');
  return c.json({ 
    status: "ok", 
    message: "tRPC endpoint",
    note: "Use POST with proper tRPC payload" 
  });
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
