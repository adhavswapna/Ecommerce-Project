import express from 'express';
import userRoutes from './routes/user.routes';

const app = express();

app.use(express.json());

// User-related routes ONLY
app.use('/users', userRoutes);

export default app;
