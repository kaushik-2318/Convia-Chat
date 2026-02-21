import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('[DB] Connection Success');

        mongoose.connection.on('error', (err) => {
            console.error('[DB] Runtime error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('[DB] Disconnected from MongoDB');
        });
    } catch (error) {
        console.error('[DB] Initial connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;
