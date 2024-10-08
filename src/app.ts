// src/app.ts

import express, { NextFunction, Response } from 'express';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import participantRoutes from './routes/participantRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/participation', participantRoutes);


export default app;
