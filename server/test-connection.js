require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

console.log('MongoDB URI (masked):', uri?.replace(/:[^:@]+@/, ':****@'));

async function testConnection() {
    const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
    });

    try {
        console.log('\nAttempting connection...');
        await client.connect();

        console.log('✅ Connected successfully!');

        const adminDb = client.db().admin();
        const dbInfo = await adminDb.listDatabases();

        console.log('\nAvailable databases:');
        dbInfo.databases.forEach(db => console.log(`  - ${db.name}`));

    } catch (error) {
        console.error('\n❌ Connection failed!');
        console.error('Error:', error.message);

        if (error.message.includes('IP')) {
            console.log('\n🔍 This looks like an IP whitelist issue.');
            console.log('Please add your IP address to MongoDB Atlas Network Access.');
        }
    } finally {
        await client.close();
    }
}

testConnection();
