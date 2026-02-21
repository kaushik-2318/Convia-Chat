import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import connectDB from './src/config/db.js';
// import { initializeSocket } from "./socket.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;
const BACKEND_URL =
    process.env.NODE_ENV === 'production' ? process.env.BACKEND_URL : `http://localhost:${PORT}`;

connectDB();

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.send('MERN Backend running 🚀');
});

setInterval(
    async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/health`);
            console.log('🔁 Self Ping Response:', res.data);
        } catch (error) {
            console.error('❌ Self Ping Error:', error.response?.status || error.message);
        }
    },
    1000 * 60 * 10,
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
