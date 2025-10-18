declare module 'npm:@supabase/supabase-js@2.57.4' {
  import { SupabaseClient, createClient as createSupabaseClient } from '@supabase/supabase-js';
  
  export const createClient: typeof createSupabaseClient;
  export type { SupabaseClient };
}