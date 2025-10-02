import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import { userRoutes } from './routes/user.route.js'; 
import { eventRoutes } from './routes/event.route.js';
import { ticketRoutes } from './routes/ticket.route.js';
dotenv.config();

connectDB();
const app = express();



const corsOptions = {
  origin: ['http://localhost:5173', 'https://event-client-red.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());


const PORT = process.env.PORT || 3000

app.use('/api/user',userRoutes);
app.use('/api/event',eventRoutes);
app.use('/api/ticket',ticketRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

