import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import express from 'express';
import dotenv from 'dotenv';

import routes from './routes/index';
import { requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(requestLogger);

app.use(express.json());

app.use('/api', routes);

app.use(errorHandler);

const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connected!');

        app.listen(PORT, () => {
            console.log(
                `🚀 Server is running on port ${PORT}, TZ: ${process.env.TZ}`
            );
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

startServer();
