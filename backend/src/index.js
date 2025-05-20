import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from requests
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
})); // Middleware to enable CORS
app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
