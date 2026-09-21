import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

const connectDB = async() => {
    try {
        if (!uri) throw new Error("MONGODB_URI is missing from your environment configuration!");
        const conn = await mongoose.connect(uri);
        console.log(` MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Database connection error:", error.message);
        process.exit(1);
    }
}

export default connectDB
