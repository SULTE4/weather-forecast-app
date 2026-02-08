const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('ERROR: MONGO_URI environment variable is not defined!');
    process.exit(1);
}

// MongoDB connection options for Atlas (cleaned up, no deprecated options)
const mongoOptions = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
};

async function connectDB() {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        console.log('Connection string:', MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
        
        // Connect with mongoose
        await mongoose.connect(MONGO_URI, mongoOptions);
        console.log('✅ Mongoose connected successfully!');
        
        // Also get native MongoDB client
        const client = new MongoClient(MONGO_URI, mongoOptions);
        await client.connect();
        console.log('✅ MongoDB native client connected successfully!');
        
        const db = client.db();
        console.log('✅ Database name:', db.databaseName);
        console.log('✅ MongoDB connection established!');
        
        return db;
    } catch (err) {
        console.error('❌ MongoDB Connection Error:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        
        if (err.message.includes('authentication failed')) {
            console.error('\n💡 Fix: Check your MongoDB username and password');
            console.error('   - Go to MongoDB Atlas → Database Access');
            console.error('   - Verify username and reset password if needed');
        } else if (err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT')) {
            console.error('\n💡 Fix: Check your network connection and MongoDB cluster status');
        } else if (err.message.includes('SSL') || err.message.includes('TLS')) {
            console.error('\n💡 Fix: SSL/TLS authentication error');
            console.error('   - Verify MongoDB Atlas Database User exists');
            console.error('   - Check Network Access whitelist (should include 0.0.0.0/0)');
            console.error('   - Try resetting database user password');
        }
        
        console.error('\nFull error:', err);
        throw err;
    }
}

module.exports = { connectDB };