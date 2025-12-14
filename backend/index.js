import { initializeApp } from 'firebase-admin/app';
import express from 'express';
import cors from 'cors';
import mockAuthMiddleware from './src/middleware/mockAuth.js';
import orderRoutes from './src/routes/orderRoutes.js';
import { onRequest } from 'firebase-functions/v2/https';

initializeApp();

const app = express();
//const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.use(mockAuthMiddleware);

app.use('/api/orders', orderRoutes);

export const index = onRequest(app);

