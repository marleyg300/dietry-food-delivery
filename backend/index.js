import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/usersRoute.js';
import dietryRoutes from './routes/dietriesRoute.js'

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/dietries', dietryRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/images')));
app.use(express.static(path.join(__dirname, '../frontend/uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'home.html'));
});

app.get('/food', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'food.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'about.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'checkout.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'contact.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'admin.html'));
});

app.get('/createDietry', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'createDietry.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
