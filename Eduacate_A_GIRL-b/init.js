import fs from 'fs';
import pool from './db.js';
import { gallery, stories, team, journey, programs, settings } from './data.js';

// Global lock to prevent multiple simultaneous initializations
let isInitializing = false;
let initPromise = null;

const init = async () => {
    // If already initializing, wait for that to complete
    if (isInitializing && initPromise) {
        console.log('⏳ Initialization already in progress, waiting...');
        return initPromise;
    }

    // If already initialized, skip
    if (isInitializing === 'complete') {
        console.log('✓ Database already initialized.');
        return;
    }

    isInitializing = true;
    const schema = fs.readFileSync('./schema.sql', 'utf8');

    initPromise = (async () => {
        try {
            console.log('Initializing database...');

            // Create tables
            await pool.query(schema);
            console.log('✓ Tables created or already exist.');

            // Check if data already exists
            const { rows } = await pool.query('SELECT COUNT(*) FROM products');
            const productCount = parseInt(rows[0].count);

            if (productCount > 0) {
                console.log(`✓ Database already has ${productCount} products. Skipping seed.`);
                isInitializing = 'complete';
                return;
            }

            console.log('Database is empty. Seeding initial data...');

            // Insert gallery
            for (const item of gallery) {
                await pool.query('INSERT INTO gallery (url, caption) VALUES ($1, $2)', [item.url, item.caption]);
            }
            console.log('✓ Gallery seeded.');

            // Insert stories
            for (const item of stories) {
                await pool.query('INSERT INTO stories (name, role, image, quote, featured) VALUES ($1, $2, $3, $4, $5)', [item.name, item.role, item.image, item.quote, item.featured]);
            }
            console.log('✓ Stories seeded.');

            // Insert team
            for (const item of team) {
                await pool.query('INSERT INTO team (name, role, image) VALUES ($1, $2, $3)', [item.name, item.role, item.image]);
            }
            console.log('✓ Team seeded.');

            // Insert journey
            for (const item of journey) {
                await pool.query('INSERT INTO journey (year, title, description) VALUES ($1, $2, $3)', [item.year, item.title, item.description]);
            }
            console.log('✓ Journey seeded.');

            // Insert programs
            for (const item of programs) {
                await pool.query('INSERT INTO programs (title, description, image, features) VALUES ($1, $2, $3, $4)', [item.title, item.description, item.image, JSON.stringify(item.features)]);
            }
            console.log('✓ Programs seeded.');

            // Insert settings (use ON CONFLICT to handle duplicates gracefully)
            for (const [key, value] of Object.entries(settings)) {
                await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [key, JSON.stringify(value)]);
            }
            console.log('✓ Settings seeded.');

            console.log('✓ Database initialization complete!');
            isInitializing = 'complete';
        } catch (err) {
            console.error('❌ Error initializing database:', err);
            isInitializing = false;
            initPromise = null;
            throw err;
        }
    })();

    return initPromise;
};

export default init;
