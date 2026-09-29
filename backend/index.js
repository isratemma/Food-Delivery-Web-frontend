import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import shopRoutes from './routes/shop.routes.js';
import itemRoutes from './routes/item.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use('/api/auth',  authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/items', itemRoutes);

app.listen(port, async () => {
  await connectDB();
  console.log(`Server started at http://localhost:${port}`);
});
