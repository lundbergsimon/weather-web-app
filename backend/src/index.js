import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';

const app = express();


const PORT = process.env.PORT;

app.use(cors()); // Enable CORS
app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api/v1', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
