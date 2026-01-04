import fs from 'fs';
import pool from './db.js';
import { products } from '../src/data/products.js';
import { gallery, stories, team, journey, programs, settings } from './data.js';

const seed = async () => {
    const schema = fs.readFileSync('./schema.sql', 'utf8');

    try {
        // Create tables
        await pool.query(schema);
        console.log('Tables created or already exist.');

        // Clear existing data
        await pool.query('TRUNCATE TABLE products, gallery, stories, team, journey, programs, settings, messages, reviews, orders RESTART IDENTITY');

        // Insert products
        for (const product of products) {
            const {
                id, name, price, category, rating, reviews, description,
                material, dimensions, origin, impact, details, story, images
            } = product;

            const query = `
                INSERT INTO products (id, name, price, category, rating, reviews, description, material, dimensions, origin, impact, details, story, images)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            `;
            const values = [
                id, name, price, category, rating, reviews, description,
                material, dimensions, origin, impact, JSON.stringify(details), JSON.stringify(story), JSON.stringify(images)
            ];
            await pool.query(query, values);
        }
        console.log('Products seeded.');

        // Insert gallery
        for (const item of gallery) {
            await pool.query('INSERT INTO gallery (url, caption) VALUES ($1, $2)', [item.url, item.caption]);
        }
        console.log('Gallery seeded.');

        // Insert stories
        for (const item of stories) {
            await pool.query('INSERT INTO stories (name, role, image, quote, featured) VALUES ($1, $2, $3, $4, $5)', [item.name, item.role, item.image, item.quote, item.featured]);
        }
        console.log('Stories seeded.');

        // Insert team
        for (const item of team) {
            await pool.query('INSERT INTO team (name, role, image) VALUES ($1, $2, $3)', [item.name, item.role, item.image]);
        }
        console.log('Team seeded.');

        // Insert journey
        for (const item of journey) {
            await pool.query('INSERT INTO journey (year, title, description) VALUES ($1, $2, $3)', [item.year, item.title, item.description]);
        }
        console.log('Journey seeded.');

        // Insert programs
        for (const item of programs) {
            await pool.query('INSERT INTO programs (title, description, image, features) VALUES ($1, $2, $3, $4)', [item.title, item.description, item.image, JSON.stringify(item.features)]);
        }
        console.log('Programs seeded.');

        // Insert settings
        for (const [key, value] of Object.entries(settings)) {
            await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2)', [key, JSON.stringify(value)]);
        }
        console.log('Settings seeded.');

        console.log('All data seeded successfully.');
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await pool.end();
    }
};

seed();
