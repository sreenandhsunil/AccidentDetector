import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@shared/schema";

// Use connection pooling for serverless environments
neonConfig.fetchConnectionCache = true;

// Get the database URL from environment variables
const sql = neon(process.env.DATABASE_URL || "");

export const db = drizzle(sql, { schema });