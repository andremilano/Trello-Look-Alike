import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const url = process.env.TURSO_CONNECTION_URL || 'file:sqlite.db';
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: url,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
