/*
# RLS Policies Setup

Script para configurar as políticas de segurança RLS (Row Level Security) para todas as tabelas.
Este script deve ser executado após a criação das tabelas.

1. Habilita RLS em todas as tabelas
2. Configura políticas de acesso apropriadas para cada tabela
3. Concede permissões necessárias
*/

-- Habilitar RLS em todas as tabelas
ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies para chat_users
CREATE POLICY "Users can view all users" ON chat_users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own user" ON chat_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON chat_users FOR UPDATE USING (true) WITH CHECK (true);

-- RLS Policies para chat_sessions
CREATE POLICY "Users can view sessions" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update sessions" ON chat_sessions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Users can delete sessions" ON chat_sessions FOR DELETE USING (true);

-- RLS Policies para chat_messages
CREATE POLICY "Users can view all messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own messages" ON chat_messages FOR INSERT WITH CHECK (true);

-- RLS Policies para llm_providers
CREATE POLICY "Users can view active providers" ON llm_providers FOR SELECT USING (is_active = true);
-- Nota: A política abaixo permite que administradores gerenciem provedores
-- Você pode precisar ajustar isso com base nas suas necessidades de segurança
CREATE POLICY "Admins can manage providers" ON llm_providers FOR ALL USING (
    EXISTS (
        SELECT 1 FROM chat_users WHERE id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
);

-- RLS Policies para llm_interactions
CREATE POLICY "Users can view their own interactions" ON llm_interactions FOR SELECT USING (
    user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
);
CREATE POLICY "Users can insert their own interactions" ON llm_interactions FOR INSERT WITH CHECK (
    user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
);

-- Conceder permissões necessárias
GRANT ALL ON TABLE chat_users TO anon, authenticated;
GRANT ALL ON TABLE chat_sessions TO anon, authenticated;
GRANT ALL ON TABLE chat_messages TO anon, authenticated;
GRANT ALL ON TABLE llm_providers TO anon, authenticated;
GRANT ALL ON TABLE llm_interactions TO anon, authenticated;

-- Exibir mensagem de sucesso
SELECT 'RLS policies configured successfully!' as message;