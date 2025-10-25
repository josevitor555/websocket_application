/*
# Database Schema Verification

Script para verificar se todas as tabelas e restrições foram criadas corretamente.
Este script pode ser executado após a criação do esquema para confirmar a estrutura.
*/

-- Verificar se todas as tabelas existem
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_users', 'chat_sessions', 'chat_messages', 'llm_providers', 'llm_interactions')
ORDER BY table_name;

-- Verificar as colunas de cada tabela
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('chat_users', 'chat_sessions', 'chat_messages', 'llm_providers', 'llm_interactions')
ORDER BY table_name, ordinal_position;

-- Verificar as constraints de chave primária
SELECT tc.table_name, tc.constraint_name, kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'PRIMARY KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN ('chat_users', 'chat_sessions', 'chat_messages', 'llm_providers', 'llm_interactions')
ORDER BY tc.table_name;

-- Verificar as constraints de chave estrangeira
SELECT tc.table_name, tc.constraint_name, kcu.column_name, 
       ccu.table_name AS foreign_table_name,
       ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND tc.table_name IN ('chat_users', 'chat_sessions', 'chat_messages', 'llm_providers', 'llm_interactions')
ORDER BY tc.table_name;

-- Verificar os índices criados
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('chat_users', 'chat_sessions', 'chat_messages', 'llm_providers', 'llm_interactions')
ORDER BY tablename, indexname;

-- Verificar se os dados iniciais foram inseridos
SELECT name, description, is_active FROM llm_providers;

-- Exibir mensagem de verificação completa
SELECT 'Database schema verification completed!' as message;