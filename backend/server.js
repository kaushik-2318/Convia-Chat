import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import connectDB from './src/config/db.js';
import router from './src/routes/index.js';
import { errorHandler } from './src/middlewares/errorHandler.js';
import { AppError } from './src/utils/AppError.js';
// import { initializeSocket } from "./socket.js";

import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());

const isProduction = process.env.NODE_ENV === 'production';

const PORT = isProduction ? process.env.PORT : 3000;
const BACKEND_URL = isProduction ? process.env.BACKEND_URL : `http://localhost:${PORT}`;

connectDB();

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/', (req, res) => {
    res.send('MERN Backend running 🚀');
});

app.use('/api', router);

app.use((req, res, next) => {
    next(
        new AppError({
            message: 'Route not found',
            statusCode: 404,
            code: 'ROUTE_NOT_FOUND',
        }),
    );
});

app.use(errorHandler);

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
