import { ensureDatabaseReady } from '../lib/db-init.ts';
import { sql } from '../lib/db.ts';

await ensureDatabaseReady();

const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('communities','exams','courses','enrollments','subjects','lectures') ORDER BY table_name;`;

console.log(JSON.stringify(rows, null, 2));
