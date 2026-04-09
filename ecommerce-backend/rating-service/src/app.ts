import express from 'express';
import ratingRoutes from './routes/rating.routes';

const app = express();

app.use(express.json());

// ✅ mount routes
app.use('/ratings', ratingRoutes);

export default app;
