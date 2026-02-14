import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are configured
const isConfigured =
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-anon-key');

if (!isConfigured) {
    console.warn('⚠️ Supabase credentials not configured. Waitlist functionality will be disabled.');
    console.warn('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file');
}

// Create client or mock client
export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        // Mock client that returns helpful errors
        from: () => ({
            insert: async () => ({
                data: null,
                error: {
                    message: 'Supabase not configured. Please add credentials to .env file.',
                    code: 'NO_CREDENTIALS'
                }
            }),
            select: () => ({
                single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
            })
        })
    };

export const isSupabaseConfigured = isConfigured;
