import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected!');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
    });
