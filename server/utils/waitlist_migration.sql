-- Waitlist Table for Email Collection
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anyone (public access for waitlist signup)
CREATE POLICY "Allow public insert" ON waitlist
    FOR INSERT
    WITH CHECK (true);

-- Only allow viewing own email (optional, if you want users to check their status)
CREATE POLICY "Users can view own email" ON waitlist
    FOR SELECT
    USING (auth.jwt() ->> 'email' = email OR auth.role() = 'anon');
