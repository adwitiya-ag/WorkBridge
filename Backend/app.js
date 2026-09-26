import express from 'express';
import cors from 'cors';
import userRouter from './src/routes/user.routes.js';
import employerRouter from './src/routes/employer.routes.js';
import jobRouter from './src/routes/job.routes.js';
import communityPostRouter from './src/routes/communityPost.routes.js'
import cookieParser from "cookie-parser";

const app = express();


const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}))

app.use(cookieParser()); //should be before the routes

//for parsing json data
app.use(express.json({
    limit: "16kb"
}))

//for parsing form data
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use("/api/users", userRouter);
app.use("/api/employers", employerRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/community-posts", communityPostRouter);

app.use(express.static('public'));

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    return res.status(statusCode).json({
        statusCode,
        success: false,
        message,
        errors: err.errors || []
    });
});

export default app;