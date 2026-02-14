-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_hash TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    normalized_data JSONB NOT NULL,
    marketplace TEXT NOT NULL,
    region TEXT NOT NULL,
    last_scanned TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full text search index for products
CREATE INDEX IF NOT EXISTS products_title_idx ON products USING GIN (to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS products_product_hash_idx ON products (product_hash);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    product_hash TEXT NOT NULL,
    product_data JSONB NOT NULL, -- Snapshot of product data at purchase
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    tracking JSONB DEFAULT '{}'::jsonb,
    payment JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Price History Table
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_hash TEXT NOT NULL,
    marketplace TEXT NOT NULL,
    region TEXT,
    price JSONB NOT NULL, -- { usd: 100, local: { amount: 90, currency: 'EUR' } }
    true_cost NUMERIC,
    vendor JSONB,
    availability BOOLEAN DEFAULT true,
    scanned_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for price history
CREATE INDEX IF NOT EXISTS price_history_product_hash_idx ON price_history (product_hash);
CREATE INDEX IF NOT EXISTS price_history_scanned_at_idx ON price_history (scanned_at);
