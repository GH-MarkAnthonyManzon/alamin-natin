// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database record type (matches your SQL schema)
interface CandidateDB {
  id: string;
  full_name: string;
  position_sought: string;
  political_affiliation: string;
  image_url_id?: string;
  education?: string;
  career_timeline?: string;
  platforms?: string;
  past_behaviors?: string;
  sources?: string;
  created_at?: string;
  updated_at?: string;
}

// Application type (what your components use)
export interface Candidate {
  id: string;
  fullName: string;
  positionSought: string;
  politicalAffiliation: string;
  imageUrlId?: string;
  education: string;
  careerTimeline: string;
  platforms: string;
  pastBehaviors: string;
  sources: Record<string, string>;
}

// Transform database record to application type
function transformCandidate(dbCandidate: CandidateDB): Candidate {
  // Parse sources JSON
  let parsedSources: Record<string, string> = {};
  if (dbCandidate.sources) {
    try {
      parsedSources = JSON.parse(dbCandidate.sources);
    } catch (e) {
      console.warn(`Failed to parse sources for ${dbCandidate.full_name}`);
    }
  }

  return {
    id: dbCandidate.id,
    fullName: dbCandidate.full_name,
    positionSought: dbCandidate.position_sought,
    politicalAffiliation: dbCandidate.political_affiliation,
    imageUrlId: dbCandidate.image_url_id || '',
    education: dbCandidate.education || '',
    careerTimeline: dbCandidate.career_timeline || '',
    platforms: dbCandidate.platforms || '',
    pastBehaviors: dbCandidate.past_behaviors || '',
    sources: parsedSources,
  };
}

export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return (data || []).map(transformCandidate);
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching candidate:', error);
    return null;
  }

  return data ? transformCandidate(data) : null;
}

export async function searchCandidates(searchTerm: string): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .ilike('full_name', `%${searchTerm}%`)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error searching candidates:', error);
    throw error;
  }

  return (data || []).map(transformCandidate);
}