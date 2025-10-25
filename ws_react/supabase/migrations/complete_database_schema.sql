/*
# Complete Application Schema v2.0

Script completo para criar todas as tabelas do banco de dados com restrições adequadas.
Este script pode ser executado diretamente no SQL Editor do Supabase.

1. Tabelas criadas:
- chat_users: Gerenciamento de usuários
- chat_sessions: Sessões de usuário
- chat_messages: Mensagens do chat
- llm_providers: Provedores de LLM
- llm_interactions: Interações com LLMs

2. Restrições implementadas:
- Chaves primárias com UUID
- Chaves estrangeiras com CASCADE apropriado
- Índices para melhor performance
- Valores padrão para campos obrigatórios
*/

-- Criar extensão para geração de UUIDs (se não existir)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Remover tabelas existentes (se houver) na ordem correta para evitar erros de FK
DROP TABLE IF EXISTS llm_interactions CASCADE;
DROP TABLE IF EXISTS llm_providers CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS chat_users CASCADE;

-- Criar tabela chat_users
CREATE TABLE chat_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    username text UNIQUE NOT NULL,
    display_name text NOT NULL,
    is_online boolean DEFAULT false,
    last_seen timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- Criar tabela chat_sessions
CREATE TABLE chat_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    session_token text UNIQUE NOT NULL,
    connected_at timestamptz DEFAULT now(),
    last_activity timestamptz DEFAULT now()
);

-- Criar tabela chat_messages
CREATE TABLE chat_messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Criar tabela llm_providers
CREATE TABLE llm_providers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    description text,
    api_key text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Criar tabela llm_interactions
CREATE TABLE llm_interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES chat_users(id) ON DELETE CASCADE,
    provider_id uuid NOT NULL REFERENCES llm_providers(id) ON DELETE CASCADE,
    prompt text NOT NULL,
    response text,
    model text,
    tokens_used integer,
    created_at timestamptz DEFAULT now()
);

-- Criar índices para melhorar a performance
CREATE INDEX idx_chat_users_username ON chat_users(username);
CREATE INDEX idx_chat_users_online ON chat_users(is_online);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_token ON chat_sessions(session_token);
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_llm_providers_name ON llm_providers(name);
CREATE INDEX idx_llm_interactions_user_id ON llm_interactions(user_id);
CREATE INDEX idx_llm_interactions_provider_id ON llm_interactions(provider_id);
CREATE INDEX idx_llm_interactions_created_at ON llm_interactions(created_at DESC);

-- Inserir dados iniciais para provedores LLM
INSERT INTO llm_providers (name, description, api_key, is_active)
VALUES 
    ('gemini', 'Google Gemini AI', 'YOUR_GEMINI_API_KEY_HERE', true),
    ('gemma', 'Google Gemma AI', 'YOUR_GEMMA_API_KEY_HERE', true);

-- Exibir mensagem de sucesso
SELECT 'Database schema created successfully!' as message;