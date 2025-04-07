import express from 'express';

const router = express.Router();

router.post('/auth/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

router.post('/auth/register', (req, res) => {
  res.json({ message: 'Registration successful' });
});

router.get('/auth/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.get('/auth/refresh', (req, res) => {
  res.json({ message: 'Refresh successful' });
});

router.get('/forecast', (req, res) => {
  res.json({ message: 'Forecast data' });
});

export default router;