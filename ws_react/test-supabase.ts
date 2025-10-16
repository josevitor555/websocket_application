import { supabase } from './src/lib/supabase';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test a simple query
    const { data, error } = await supabase
      .from('chat_users')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase connection error:', error);
      return;
    }

    console.log('Supabase connection successful');
    console.log('Test query result:', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testConnection();