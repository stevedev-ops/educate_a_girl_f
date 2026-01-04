CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    rating DECIMAL(2, 1),
    reviews INTEGER,
    description TEXT,
    material VARCHAR(255),
    dimensions VARCHAR(100),
    origin VARCHAR(100),
    impact VARCHAR(255),
    details JSONB,
    story JSONB,
    images JSONB,
    stock INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT
);

CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    image TEXT,
    quote TEXT,
    featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    role VARCHAR(255),
    image TEXT
);

CREATE TABLE IF NOT EXISTS journey (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50),
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE IF NOT EXISTS programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    image TEXT,
    features JSONB
);

CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    message TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50),
    rating INT,
    comment TEXT,
    author VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved'
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    items JSONB,
    total DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    customer_info JSONB,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(50) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_id, product_id)
);
