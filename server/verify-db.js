require('dotenv').config();
const mongoose = require('mongoose');

console.log('='.repeat(50));
console.log('MongoDB Connection Test');
console.log('='.repeat(50));

const uri = process.env.MONGODB_URI;
console.log('\nConnection URI (masked):', uri.replace(/:[^:@]+@/, ':****@'));

async function testConnection() {
    console.log('\nAttempting to connect...\n');

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log('✅ SUCCESS! MongoDB Connected');
        console.log('   Host:', mongoose.connection.host);
        console.log('   Database:', mongoose.connection.name);
        console.log('   Ready State:', mongoose.connection.readyState);
        console.log('\n='.repeat(50));

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.log('❌ FAILED! Connection Error');
        console.log('   Error:', error.message);
        console.log('\n='.repeat(50));

        if (error.message.includes('IP')) {
            console.log('\n💡 Solution: Add your IP to MongoDB Atlas Network Access');
        }

        process.exit(1);
    }
}

testConnection();
