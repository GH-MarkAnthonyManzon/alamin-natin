import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type-safe database helpers
export async function getCandidates() {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return data;
}

export async function getCandidateById(id: string) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching candidate:', error);
    throw error;
  }

  return data;
}

export async function searchCandidates(searchTerm: string) {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .ilike('full_name', `%${searchTerm}%`)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error searching candidates:', error);
    throw error;
  }

  return data;
}