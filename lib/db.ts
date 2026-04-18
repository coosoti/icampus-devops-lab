import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to your .env.local file.");
}

// In production (Vercel), use a single connection with max 1
// to stay within Supabase's connection limits on the free tier.
// In development, use a small pool.
const client = postgres(connectionString, {
  max: process.env.NODE_ENV === "production" ? 1 : 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });