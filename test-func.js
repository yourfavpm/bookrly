import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function test() {
  // First login to get a session
  const { data: auth, error: authError } = await supabase.auth.signInWithPassword({
    email: 'hello@skeduley.com', // wait, do I know their email?
    password: 'password123'
  });
  // Without login, I can't invoke it with an auth header!
}
test();
