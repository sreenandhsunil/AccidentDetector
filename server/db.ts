// server/db.ts

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../shared/schema';

// Initialize SQLite database
const sqlite = new Database('sqlite.db');

// Create the Drizzle ORM instance with your schema
export const db = drizzle(sqlite, { schema });

// Migrations should be run manually using CLI:
// npx drizzle-kit push
