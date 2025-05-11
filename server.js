require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const redisClient = require('./config/redis');
const app = express();

const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use(express.json());

app.use('/api', transactionRoutes);
app.use('/api/reports', reportRoutes);


// Test route
app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'FraudAlert backend is live!' });
});

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // await sequelize.sync({ force: true  });
    // console.log('Database synced');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Startup error:', error);
  }
};

startServer();
