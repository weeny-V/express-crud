import express from 'express';
import router from './routes/index.ts';
import { errorHandler } from './common/middleware/error-handler.ts';

export const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
    return res.send('Hello World');
});

app.use('/api/v1', router);

app.use((_req, res) => {
    return res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);
