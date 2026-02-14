require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Hide password

async function testConnection() {
    try {
        console.log('\n1. Attempting to connect to MongoDB Atlas...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        console.log('✅ SUCCESS! MongoDB Connected:', conn.connection.host);
        console.log('Database:', conn.connection.name);
        console.log('Connection state:', conn.connection.readyState);

        await mongoose.connection.close();
        console.log('\n✅ Connection test completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!');
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);

        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n🔍 Diagnosis: DNS/Network Issue');
            console.log('Possible causes:');
            console.log('  1. Firewall blocking MongoDB Atlas (port 27017)');
            console.log('  2. VPN or proxy interfering with connection');
            console.log('  3. DNS resolution failing');
            console.log('  4. Network restrictions in your location');
            console.log('\n💡 Solutions:');
            console.log('  1. Check your firewall settings');
            console.log('  2. Try disabling VPN temporarily');
            console.log('  3. Check if MongoDB Atlas is accessible from your network');
            console.log('  4. Verify the connection string is correct');
        } else if (error.message.includes('authentication')) {
            console.log('\n🔍 Diagnosis: Authentication Issue');
            console.log('  - Check username and password in .env file');
        } else {
            console.log('\n🔍 Diagnosis: Unknown error');
            console.log('Full error:', error);
        }

        process.exit(1);
    }
}

testConnection();
