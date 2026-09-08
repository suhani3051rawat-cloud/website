import express from 'express';
import dotenv from 'dotenv';
import userAuthRouter from './routes/userAuthRouter.js'
import cookieParser from 'cookie-parser';
import adminPannelRoute from './routes/adminPannelRoute.js';
import cors from 'cors';

let app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:5173",
    "https://farmera-net.netlify.app"
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
app.use('/user/Auth', userAuthRouter);
app.use('/admin/Auth', adminPannelRoute);

export default app; 