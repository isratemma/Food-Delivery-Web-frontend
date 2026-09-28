import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);

app.listen(port, async () => {
  await connectDB();
  console.log(`Server started at http://localhost:${port}`);

  // Warn if email is not configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.warn('⚠️  EMAIL_USER not set — forgot password emails will not work.');
    console.warn('   Add EMAIL_USER and EMAIL_PASS to backend/.env');
  } else {
    console.log(`✉️  Email configured: ${process.env.EMAIL_USER}`);
  }
});
