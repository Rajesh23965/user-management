import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import 'express-async-errors';


import { connectDB } from './config/database';
import redis from './config/redis';


import { apiLimiter, authLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';


import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import roleRoutes from './routes/roleRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


app.use(apiLimiter);


app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', roleRoutes);

/* 404 handler */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        timestamp: new Date().toISOString()
    });
});

/* Error handler */
app.use(errorHandler);

/* Start server */
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Connect to Redis 
        try {
            await redis.connect();
        } catch (error) {
            console.warn('Redis connection failed, continuing without Redis caching');
        }

        app.listen(PORT, () => {
            console.log(`
      Server is running!
      Port: ${PORT}
      Environment: ${process.env.NODE_ENV}
      API URL: http://localhost:${PORT}
      
      Available Endpoints:
      POST   /api/auth/register     - Register new user
      POST   /api/auth/login        - Login user
      POST   /api/auth/logout       - Logout user
      
      Admin Endpoints:
      POST   /api/admin/assign-role - Assign role to user
      GET    /api/admin/users       - Get all users
      PUT    /api/admin/users/:id   - Update user
      DELETE /api/admin/users/:id   - Delete user
      
      Role 1 Endpoint:
      GET    /api/role1/users       - View users
      
      Role 2 Endpoint:
      GET    /api/role2/message     - Get welcome message
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await redis.disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await redis.disconnect();
    process.exit(0);
});

startServer();

export default app;