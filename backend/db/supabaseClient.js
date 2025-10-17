import { createClient } from '@supabase/supabase-js';

// Carregar variáveis de ambiente
import dotenv from 'dotenv';

dotenv.config();

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL não está definida nas variáveis de ambiente');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY não está definida nas variáveis de ambiente');
}

// Criar cliente do Supabase com a service key (acesso total)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export { supabase };