-- Migration para corrigir a chave primária da tabela chat_messages
-- Esta migração corrige problemas com a geração automática de UUID e chave primária

-- Primeiro, verificar se a coluna id existe e tem o tipo correto
ALTER TABLE chat_messages 
ALTER COLUMN id TYPE uuid USING id::uuid;

-- Garantir que a coluna id não seja NULL
ALTER TABLE chat_messages 
ALTER COLUMN id SET NOT NULL;

-- Adicionar valor padrão para geração automática de UUID
ALTER TABLE chat_messages 
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Adicionar constraint de chave primária se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'chat_messages' 
    AND constraint_type = 'PRIMARY KEY'
  ) THEN
    ALTER TABLE chat_messages 
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);
  END IF;
END
$$;

-- Verificar e corrigir a coluna created_at se necessário
ALTER TABLE chat_messages 
ALTER COLUMN created_at SET DEFAULT now();

-- Criar índice na coluna created_at se não existir
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages (created_at DESC);

-- Atualizar registros existentes que possam ter ID NULL
UPDATE chat_messages 
SET id = gen_random_uuid(), 
    created_at = COALESCE(created_at, now())
WHERE id IS NULL;

-- Garantir que a constraint de chave estrangeira para user_id exista
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE table_name = 'chat_messages' 
    AND constraint_type = 'FOREIGN KEY'
    AND constraint_name = 'chat_messages_user_id_fkey'
  ) THEN
    ALTER TABLE chat_messages 
    ADD CONSTRAINT chat_messages_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES chat_users(id) ON DELETE CASCADE;
  END IF;
END
$$;