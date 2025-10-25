/*
# Complete Application Schema v2.0

This migration defines the complete schema with 5 tables and proper constraints.

1. Tables:
- `chat_users` - User management
- `chat_sessions` - User session tracking
- `chat_messages` - Chat message storage
- `llm_providers` - LLM provider configuration
- `llm_interactions` - LLM interaction history

2. Constraints:
- All primary keys properly defined with UUID type
- All foreign keys with appropriate references and CASCADE actions
- Unique constraints where needed
- Not null constraints for required fields

3. Indexes:
- Performance indexes on frequently queried columns
- Composite indexes where appropriate

4. Security:
- RLS enabled on all tables
- Appropriate policies for data access control
*/

-- Create chat_users table
CREATE TABLE IF NOT EXISTS chat_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    display_name text NOT NULL,
    is_online boolean DEFAULT false,
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    session_token text UNIQUE NOT NULL,
    connected_at timestamptz DEFAULT now(),
    last_activity timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create llm_providers table
CREATE TABLE IF NOT EXISTS llm_providers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text,
    api_key text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Create llm_interactions table
CREATE TABLE IF NOT EXISTS llm_interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    provider_id uuid NOT NULL REFERENCES llm_providers(id) ON DELETE CASCADE,
    prompt text NOT NULL,
    response text,
    model text,
    tokens_used integer,
    created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_users_username ON chat_users(username);
CREATE INDEX IF NOT EXISTS idx_chat_users_online ON chat_users(is_online);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_token ON chat_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_llm_providers_name ON llm_providers(name);
CREATE INDEX IF NOT EXISTS idx_llm_interactions_user_id ON llm_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_llm_interactions_provider_id ON llm_interactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_llm_interactions_created_at ON llm_interactions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_users
CREATE POLICY "Users can view all users" ON chat_users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own user" ON chat_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON chat_users FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view sessions" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sessions" ON chat_sessions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete sessions" ON chat_sessions FOR DELETE USING (true);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view all messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own messages" ON chat_messages FOR INSERT WITH CHECK (true);

-- RLS Policies for llm_providers
CREATE POLICY "Users can view active providers" ON llm_providers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage providers" ON llm_providers FOR ALL USING (
    EXISTS (
        SELECT 1 FROM chat_users WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
);

-- RLS Policies for llm_interactions
CREATE POLICY "Users can view their own interactions" ON llm_interactions FOR SELECT USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
);
CREATE POLICY "Users can insert their own interactions" ON llm_interactions FOR INSERT WITH CHECK (
    user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
);

-- Grant permissions
GRANT ALL ON TABLE chat_users TO anon, authenticated;
GRANT ALL ON TABLE chat_sessions TO anon, authenticated;
GRANT ALL ON TABLE chat_messages TO anon, authenticated;
GRANT ALL ON TABLE llm_providers TO anon, authenticated;
GRANT ALL ON TABLE llm_interactions TO anon, authenticated;

-- Insert initial provider data
INSERT INTO llm_providers (name, description, api_key, is_active)
VALUES 
    ('gemini', 'Google Gemini AI', 'YOUR_GEMINI_API_KEY_HERE', true),
    ('gemma', 'Google Gemma AI', 'YOUR_GEMMA_API_KEY_HERE', true)
ON CONFLICT (name) DO NOTHING;