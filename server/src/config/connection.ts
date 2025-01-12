import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('MONGODB_URI',process.env.MONGODB_URI);

const MONGO_CONNECTION = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

const openDB = async (): Promise<typeof mongoose.connection> =>{
    try {
        if(!MONGO_CONNECTION) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        await mongoose.connect(MONGO_CONNECTION); 
        console.log('Database connected.');
        return mongoose.connection;
    } catch(error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed.');
    }
}
const db = openDB().catch((error) => {
    console.error('Failed to connect to the database:',error)
    process.exit(1)
});

export default db;
