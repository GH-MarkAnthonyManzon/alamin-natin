import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// Try loading from multiple .env files
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const envPath = resolve(process.cwd(), file);
  if (existsSync(envPath)) {
    console.log(`Loading environment from: ${file}`);
    config({ path: envPath });
    break;
  }
}

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Debug: Log to verify environment variables are loaded
console.log('Environment check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'EXISTS' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CandidateRow {
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

async function seedCandidates() {
  try {
    console.log('🌱 Starting database seed...');

    // Read CSV file
    const csvPath = path.join(process.cwd(), 'data', 'SENATOR-DATAS_rows.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error(`❌ CSV file not found at: ${csvPath}`);
      console.log('💡 Please create a data/SENATOR-DATAS_rows.csv file first');
      process.exit(1);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    console.log(`📄 Found ${records.length} candidates in CSV`);

// Transform CSV records to database format
    const candidates: CandidateRow[] = records.map((record: any) => {
      // Parse JSON fields if they exist
      const parseJsonField = (field: string) => {
        if (!field || field.trim() === '') return [];
        try {
          return JSON.parse(field);
        } catch (e) {
          console.warn(`Warning: Failed to parse JSON for field, using empty array`);
          return [];
        }
      };

      const parseSources = (field: string) => {
        if (!field || field.trim() === '') return {};
        try {
          return JSON.parse(field);
        } catch (e) {
          return {};
        }
      };

      return {
        id: record.id || record.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        full_name: record.full_name,
        position_sought: 'Senator',
        political_affiliation: record.political_affiliation || 'Unknown',
        image_url_id: record.image_url_id || '',
        education: record.education || '',
        career_timeline: record.career_timeline || '',
        platforms: record.platforms_and_promises || '',
        past_behaviors: record.past_behaviors || '',
        sources: record.sources || '',
      };
    });

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing candidates...');
    const { error: deleteError } = await supabase
      .from('candidates')
      .delete()
      .neq('id', ''); // Delete all records

    if (deleteError) {
      console.error('⚠️  Error clearing data:', deleteError.message);
    }

    // Insert candidates in batches (Supabase has a limit)
    const batchSize = 100;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      
      console.log(`📤 Inserting batch ${Math.floor(i / batchSize) + 1}...`);
      
      const { data, error } = await supabase
        .from('candidates')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch:`, error.message);
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(`✅ Successfully inserted ${batch.length} candidates`);
      }
    }

    console.log('\n🎉 Seeding complete!');
    console.log(`✅ Success: ${successCount} candidates`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} candidates`);
    }

    // Verify the data
    const { count } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📊 Total candidates in database: ${count}`);

  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    process.exit(1);
  }
}

// Run the seed function
seedCandidates();