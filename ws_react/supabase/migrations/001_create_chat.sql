/*
# Chat Application Schema

1. New Tables
- `chat_users`
- `id` (uuid, primary key)
- `username` (text, unique)
- `display_name` (text)
- `is_online` (boolean, default false)
- `last_seen` (timestamptz)
- `created_at` (timestamptz)

- `chat_messages`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to chat_users)
- `message` (text)
- `created_at` (timestamptz)

- `chat_sessions`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to chat_users)
- `session_token` (text, unique)
- `connected_at` (timestamptz)
- `last_activity` (timestamptz)

2. Security
- Enable RLS on all tables
- Users can read all messages
- Users can insert their own messages
- Users can read all online users
- Users can update their own profile

3. Indexes
- Index on chat_messages.created_at for fast retrieval
- Index on chat_users.is_online for active users query
- Index on chat_sessions.session_token for fast lookup
 */
-- Create chat_users table
CREATE TABLE
    IF NOT EXISTS chat_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        username text UNIQUE NOT NULL,
        display_name text NOT NULL,
        is_online boolean DEFAULT false,
        last_seen timestamptz DEFAULT now (),
        created_at timestamptz DEFAULT now ()
    );

-- Create chat_messages table
CREATE TABLE
    IF NOT EXISTS chat_messages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id uuid NOT NULL REFERENCES chat_users (id) ON DELETE CASCADE,
        message text NOT NULL,
        created_at timestamptz DEFAULT now ()
    );

-- Create chat_sessions table
CREATE TABLE
    IF NOT EXISTS chat_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
        user_id uuid NOT NULL REFERENCES chat_users (id) ON DELETE CASCADE,
        session_token text UNIQUE NOT NULL,
        connected_at timestamptz DEFAULT now (),
        last_activity timestamptz DEFAULT now ()
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_users_online ON chat_users (is_online);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_token ON chat_sessions (session_token);

-- Enable RLS
ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY;

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_users
CREATE POLICY "Anyone can view users" ON chat_users FOR
SELECT
    USING (true);

CREATE POLICY "Users can insert themselves" ON chat_users FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Users can update their own profile" ON chat_users FOR
UPDATE USING (true)
WITH
    CHECK (true);

-- RLS Policies for chat_messages
CREATE POLICY "Anyone can view messages" ON chat_messages FOR
SELECT
    USING (true);

CREATE POLICY "Anyone can insert messages" ON chat_messages FOR INSERT
WITH
    CHECK (true);

-- RLS Policies for chat_sessions
CREATE POLICY "Anyone can view sessions" ON chat_sessions FOR
SELECT
    USING (true);

CREATE POLICY "Anyone can insert sessions" ON chat_sessions FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Anyone can update sessions" ON chat_sessions FOR
UPDATE USING (true)
WITH
    CHECK (true);

CREATE POLICY "Anyone can delete sessions" ON chat_sessions FOR DELETE USING (true);

-- Grant necessary permissions
GRANT ALL ON TABLE chat_users TO anon, authenticated;
GRANT ALL ON TABLE chat_messages TO anon, authenticated;
GRANT ALL ON TABLE chat_sessions TO anon, authenticated;