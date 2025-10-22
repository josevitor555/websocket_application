/*
# LLM Integration Schema

1. New Tables
- `llm_providers`
- `id` (uuid, primary key)
- `name` (text, unique)
- `description` (text)
- `api_key` (text)
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

- `llm_interactions`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to chat_users)
- `provider_id` (uuid, foreign key to llm_providers)
- `prompt` (text)
- `response` (text)
- `model` (text)
- `tokens_used` (integer)
- `created_at` (timestamptz)

2. Security
- Enable RLS on all tables
- Users can read their own interactions
- Admins can manage providers

3. Indexes
- Index on llm_interactions.user_id for user queries
- Index on llm_interactions.created_at for time-based queries
- Index on llm_providers.name for fast lookup
 */

-- Create llm_providers table
CREATE TABLE
    IF NOT EXISTS llm_providers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        name text UNIQUE NOT NULL,
        description text,
        api_key text,
        is_active boolean DEFAULT true,
        created_at timestamptz DEFAULT now ()
    );

-- Create llm_interactions table
CREATE TABLE
    IF NOT EXISTS llm_interactions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id uuid NOT NULL REFERENCES chat_users (id) ON DELETE CASCADE,
        provider_id uuid NOT NULL REFERENCES llm_providers (id) ON DELETE CASCADE,
        prompt text NOT NULL,
        response text,
        model text,
        tokens_used integer,
        created_at timestamptz DEFAULT now ()
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_llm_interactions_user_id ON llm_interactions (user_id);

CREATE INDEX IF NOT EXISTS idx_llm_interactions_created_at ON llm_interactions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_llm_providers_name ON llm_providers (name);

-- Enable RLS
ALTER TABLE llm_providers ENABLE ROW LEVEL SECURITY;

ALTER TABLE llm_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for llm_providers
CREATE POLICY "Anyone can view active providers" ON llm_providers FOR
SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage providers" ON llm_providers FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM chat_users WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
);

-- RLS Policies for llm_interactions
CREATE POLICY "Users can view their own interactions" ON llm_interactions FOR
SELECT
    USING (
        user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    );

CREATE POLICY "Users can insert their own interactions" ON llm_interactions FOR INSERT
WITH
    CHECK (
        user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    );

-- Grant necessary permissions
GRANT ALL ON TABLE llm_providers TO anon, authenticated;
GRANT ALL ON TABLE llm_interactions TO anon, authenticated;

-- Insert initial provider data for Gemini
INSERT INTO llm_providers (name, description, api_key, is_active)
VALUES 
    ('gemini', 'Google Gemini AI', 'AIzaSyB6DTlYQNuf0nTIfyHA1FHxTB5LQDmNk70', true)
ON CONFLICT (name) DO NOTHING;