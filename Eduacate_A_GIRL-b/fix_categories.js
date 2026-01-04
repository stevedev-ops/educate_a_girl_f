import pool from './db.js';

const fixCategories = async () => {
    try {
        const categories = ["Handmade Crafts", "Sustainable Apparel", "Jewelry", "Eco-Friendly"];
        await pool.query('UPDATE settings SET value = $1 WHERE key = $2', [JSON.stringify(categories), 'categories']);
        console.log('Categories fixed successfully.');
    } catch (err) {
        console.error('Error fixing categories:', err);
    } finally {
        await pool.end();
    }
};

fixCategories();
