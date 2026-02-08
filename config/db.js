require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const mongoose = require('mongoose');
const {MongoClient, ObjectId} = require('mongodb');

const dbName = 'weatherDB';
const client = new MongoClient(MONGO_URI);

async function connectDB(){
    try{
        await client.connect();
        await mongoose.connect(MONGO_URI);
        const db = client.db(dbName);
        console.log('mongodb connected successfully');
        return db;
    } catch(err){
        console.log('failed to connect to mongodb');
        throw err
    }
}

module.exports = { connectDB };