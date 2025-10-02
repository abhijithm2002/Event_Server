import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    console.log('Entered MongoDB connection');

    try {
        const connect = await mongoose.connect(process.env.MONGO_URI as string, {
            minPoolSize: 3, // optional
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // stop server if DB connection fails
    }
};

export default connectDB;
