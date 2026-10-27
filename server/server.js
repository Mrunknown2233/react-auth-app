import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use('/api/auth', authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => console.log('API running on port', process.env.PORT || 5000));
  })
  .catch((e) => { console.error('MongoDB connection error:', e.message); process.exit(1); });
