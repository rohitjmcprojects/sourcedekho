import { ensureDatabaseReady } from '../lib/db-init.ts';
import { sql } from '../lib/db.ts';

await ensureDatabaseReady();

const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('exams','courses','subjects','day_wise','syllabus_wise') ORDER BY table_name;`;

console.log(JSON.stringify(rows, null, 2));
