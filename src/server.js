const express = require ('express');
const app = express();
const dotenv = require('dotenv');
require('dotenv').config();
const mongoose = require('mongoose');
const  userRoutes = require('./routes/user.routes');
const cors = require('cors');
const helmet = require('helmet');
// const requestLogger = require('./middleware/requestLogger');

const PORT= process.env.PORT || 5000;

//Middleware 
app.use(cors({
  origin: [
    'http://localhost:5173', 
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json()) ;
// app.use(requestLogger);

//Routes
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});