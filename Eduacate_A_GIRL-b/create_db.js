import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const createDb = async () => {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: 'postgres', // Connect to default postgres DB to create new DB
        password: process.env.DB_PASSWORD || 'postgres',
        port: process.env.DB_PORT || 5432,
    });

    try {
        await client.connect();
        const dbName = process.env.DB_NAME || 'educate_a_girl';
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database ${dbName} created successfully.`);
        } else {
            console.log(`Database ${dbName} already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
};

createDb();
