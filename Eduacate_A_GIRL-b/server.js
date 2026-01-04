import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup static file serving for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'EARG API Server',
        status: 'running',
        endpoints: {
            products: '/api/products',
            gallery: '/api/gallery',
            stories: '/api/stories',
            team: '/api/team',
            journey: '/api/journey',
            programs: '/api/programs',
            messages: '/api/messages',
            reviews: '/api/reviews',
            settings: '/api/settings/:key',
            upload: '/api/upload'
        }
    });
});

// --- PRODUCTS ---
app.get('/api/products', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
    try {
        let { id, name, price, category, rating, reviews, description, material, dimensions, origin, impact, details, story, images, stock } = req.body;
        if (!id) {
            id = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
        const query = `INSERT INTO products (id, name, price, category, rating, reviews, description, material, dimensions, origin, impact, details, story, images, stock) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;
        const values = [id, name, price, category, rating, reviews, description, material, dimensions, origin, impact, JSON.stringify(details), JSON.stringify(story), JSON.stringify(images), stock || 0];
        const { rows } = await pool.query(query, values);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, rating, reviews, description, material, dimensions, origin, impact, details, story, images, stock } = req.body;
        // Simplified update for brevity, ideally construct query dynamically
        const query = `UPDATE products SET name=$1, price=$2, category=$3, rating=$4, reviews=$5, description=$6, material=$7, dimensions=$8, origin=$9, impact=$10, details=$11, story=$12, images=$13, stock=$14 WHERE id=$15 RETURNING *`;
        const values = [name, price, category, rating, reviews, description, material, dimensions, origin, impact, JSON.stringify(details), JSON.stringify(story), JSON.stringify(images), stock || 0, id];
        const { rows } = await pool.query(query, values);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.json({ message: 'Deleted' });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- GALLERY ---
app.get('/api/gallery', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM gallery ORDER BY id'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/gallery', async (req, res) => {
    try {
        const { url, caption } = req.body;
        const { rows } = await pool.query('INSERT INTO gallery (url, caption) VALUES ($1, $2) RETURNING *', [url, caption]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/gallery/:id', async (req, res) => {
    try { await pool.query('DELETE FROM gallery WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- STORIES ---
app.get('/api/stories', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM stories ORDER BY id'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/stories', async (req, res) => {
    try {
        const { name, role, image, quote, featured } = req.body;
        const { rows } = await pool.query('INSERT INTO stories (name, role, image, quote, featured) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, role, image, quote, featured]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/stories/:id', async (req, res) => {
    try {
        const { name, role, image, quote, featured } = req.body;
        const { rows } = await pool.query('UPDATE stories SET name=$1, role=$2, image=$3, quote=$4, featured=$5 WHERE id=$6 RETURNING *', [name, role, image, quote, featured, req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/stories/:id', async (req, res) => {
    try { await pool.query('DELETE FROM stories WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- TEAM ---
app.get('/api/team', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM team ORDER BY id'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/team', async (req, res) => {
    try {
        const { name, role, image } = req.body;
        const { rows } = await pool.query('INSERT INTO team (name, role, image) VALUES ($1, $2, $3) RETURNING *', [name, role, image]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/team/:id', async (req, res) => {
    try {
        const { name, role, image } = req.body;
        const { rows } = await pool.query('UPDATE team SET name=$1, role=$2, image=$3 WHERE id=$4 RETURNING *', [name, role, image, req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/team/:id', async (req, res) => {
    try { await pool.query('DELETE FROM team WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- JOURNEY ---
app.get('/api/journey', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM journey ORDER BY id DESC'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/journey', async (req, res) => {
    try {
        const { year, title, description } = req.body;
        const { rows } = await pool.query('INSERT INTO journey (year, title, description) VALUES ($1, $2, $3) RETURNING *', [year, title, description]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/journey/:id', async (req, res) => {
    try {
        const { year, title, description } = req.body;
        const { rows } = await pool.query('UPDATE journey SET year=$1, title=$2, description=$3 WHERE id=$4 RETURNING *', [year, title, description, req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/journey/:id', async (req, res) => {
    try { await pool.query('DELETE FROM journey WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PROGRAMS ---
app.get('/api/programs', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM programs ORDER BY id'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/programs', async (req, res) => {
    try {
        const { title, description, image, features } = req.body;
        const { rows } = await pool.query('INSERT INTO programs (title, description, image, features) VALUES ($1, $2, $3, $4) RETURNING *', [title, description, image, JSON.stringify(features)]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/programs/:id', async (req, res) => {
    try {
        const { title, description, image, features } = req.body;
        const { rows } = await pool.query('UPDATE programs SET title=$1, description=$2, image=$3, features=$4 WHERE id=$5 RETURNING *', [title, description, image, JSON.stringify(features), req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/programs/:id', async (req, res) => {
    try { await pool.query('DELETE FROM programs WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SETTINGS ---
app.get('/api/settings/:key', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [req.params.key]);
        if (rows.length === 0) return res.json(null); // Return null if not found (matching API behavior mostly)
        res.json(rows[0].value);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/settings/:key', async (req, res) => {
    try {
        const { value } = req.body; // Expects { value: ... } or { ids: ... } ? Frontend sends JSON.stringify({ ids }) or { categories } or { value }
        // The frontend api.js sends:
        // updateHomeProductIds -> { ids }
        // updateCategories -> { categories }
        // updateSettings -> { value }
        // We need to handle this variance or normalize it.
        // Let's assume we store whatever is in the body as the value, or specific logic.

        let storedValue = value;
        if (req.body.ids) storedValue = req.body.ids;
        if (req.body.categories) storedValue = req.body.categories;

        const query = `INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2 RETURNING value`;
        const { rows } = await pool.query(query, [req.params.key, JSON.stringify(storedValue)]);
        res.json(rows[0].value);
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- MESSAGES ---
app.post('/api/messages', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const { rows } = await pool.query('INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *', [name, email, message]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/messages', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM messages ORDER BY date DESC'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/messages/:id/read', async (req, res) => {
    try {
        const { read } = req.body;
        const { rows } = await pool.query('UPDATE messages SET read=$1 WHERE id=$2 RETURNING *', [read, req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/messages/:id', async (req, res) => {
    try { await pool.query('DELETE FROM messages WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- REVIEWS ---
app.get('/api/reviews/product/:productId', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM reviews WHERE product_id = $1 AND status = \'approved\' ORDER BY date DESC', [req.params.productId]); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/reviews/pending', async (req, res) => {
    try { const { rows } = await pool.query('SELECT * FROM reviews WHERE status = \'pending\' ORDER BY date DESC'); res.json(rows); } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/reviews', async (req, res) => {
    try {
        const { productId, rating, comment, author } = req.body;
        const { rows } = await pool.query('INSERT INTO reviews (product_id, rating, comment, author) VALUES ($1, $2, $3, $4) RETURNING *', [productId, rating, comment, author]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/reviews/:id/approve', async (req, res) => {
    try {
        const { rows } = await pool.query('UPDATE reviews SET status=\'approved\' WHERE id=$1 RETURNING *', [req.params.id]);
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/reviews/:id', async (req, res) => {
    try { await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]); res.json({ message: 'Deleted' }); } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- UPLOAD ---
// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});


// --- CHECKOUT & ORDERS ---
app.post('/api/checkout', async (req, res) => {
    // Mock payment success
    res.json({ success: true, message: 'Payment processed successfully' });
});

app.post('/api/orders', async (req, res) => {
    try {
        const { items, total, customerInfo } = req.body;
        const { rows } = await pool.query('INSERT INTO orders (items, total, customer_info) VALUES ($1, $2, $3) RETURNING *', [JSON.stringify(items), total, JSON.stringify(customerInfo)]);
        res.status(201).json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/orders/:id', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
        res.json(rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- WISHLIST ---
app.get('/api/wishlist/:session_id', async (req, res) => {
    try {
        const { session_id } = req.params;
        const query = `
            SELECT w.id, w.product_id, p.name, p.price, p.description, p.images, p.stock, p.category
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.session_id = $1
        `;
        const { rows } = await pool.query(query, [session_id]);
        res.json({ message: 'success', data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/wishlist', async (req, res) => {
    try {
        const { session_id, product_id } = req.body;
        const query = 'INSERT INTO wishlist (session_id, product_id) VALUES ($1, $2) ON CONFLICT (session_id, product_id) DO NOTHING RETURNING *';
        const { rows } = await pool.query(query, [session_id, product_id]);
        res.status(201).json({ message: 'success', data: rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/wishlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM wishlist WHERE id = $1', [id]);
        res.json({ message: 'success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
