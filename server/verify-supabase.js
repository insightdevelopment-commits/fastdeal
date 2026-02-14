require('dotenv').config();
const supabase = require('./config/supabase');

async function testSupabaseConnection() {
    console.log('Testing Supabase Connection...');
    console.log('URL:', process.env.SUPABASE_URL);

    // Check if keys are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY || process.env.SUPABASE_URL.includes('your-project')) {
        console.error('❌ ERROR: Supabase credentials not configured in .env file');
        process.exit(1);
    }

    try {
        // Try to select from products table
        // This validates connection and if table exists
        const { data, error } = await supabase
            .from('products')
            .select('count')
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error('❌ Connection Failed or Table Missing:', error.message);
            console.log('\nTip: Did you run the migration SQL script in Supabase?');
            process.exit(1);
        }

        console.log('✅ SUCCESS! Connected to Supabase');
        console.log('   Tables accessible.');

        process.exit(0);

    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
        process.exit(1);
    }
}

testSupabaseConnection();
