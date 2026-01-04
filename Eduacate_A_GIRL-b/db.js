import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Render provides DATABASE_URL, use it if available, otherwise use individual env vars
const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    })
    : new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'educate_a_girl',
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
    });

export const query = (text, params) => pool.query(text, params);
export default pool;
