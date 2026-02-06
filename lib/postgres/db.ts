import { Pool, QueryResult, QueryResultRow } from 'pg';

// 1. Define the type for our global variable to avoid 'any'
declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const pool =
  global.pgPool ||
  new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: parseInt(process.env.PGPORT || '5432', 10),
  });

// 2. Assign to global in development to prevent connection leaks
if (process.env.NODE_ENV !== 'production') {
  global.pgPool = pool;
}

// 3. Use generics for the query function so it's type-safe and ESLint friendly
export const query = <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};