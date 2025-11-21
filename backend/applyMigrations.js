import { supabase } from './db/supabaseClient.js';
import fs from 'fs';
import path from 'path';

async function applyMigrations() {
  try {
    console.log('Aplicando migrações...');
    
    // Ler e aplicar a migração de tabelas LLM
    const migrationPath = path.join(process.cwd(), '..', 'ws_react', 'supabase', 'migrations', 'add_llm_tables.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Executando migração:', migrationPath);
    
    // Executar a migração
    const { error } = await supabase.rpc('execute_sql', { sql: migrationSql });
    
    if (error) {
      console.error('Erro ao aplicar migração:', error);
      return;
    }
    
    console.log('✓ Migração aplicada com sucesso!');
    
    // Verificar se as tabelas foram criadas
    console.log('Verificando criação das tabelas...');
    
    const { data: providersTable, error: providersError } = await supabase
      .from('llm_providers')
      .select('count()');
    
    if (providersError) {
      console.error('Erro ao verificar tabela llm_providers:', providersError);
    } else {
      console.log('Tabela llm_providers criada com sucesso!');
    }
    
    const { data: interactionsTable, error: interactionsError } = await supabase
      .from('llm_interactions')
      .select('count()');
    
    if (interactionsError) {
      console.error('Erro ao verificar tabela llm_interactions:', interactionsError);
    } else {
      console.log('✓ Tabela llm_interactions criada com sucesso!');
    }
    
  } catch (error) {
    console.error('Erro durante a aplicação das migrações:', error);
  }
}

applyMigrations();
