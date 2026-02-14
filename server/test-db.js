require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Error:');
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    });
