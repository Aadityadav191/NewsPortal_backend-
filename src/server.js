const express = require ('express');
const app = express();
const dotenv = require('dotenv');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const articleRoutes = require('./routes/article.routes');


const PORT= process.env.PORT || 8000;


// Connect to MongoDB
connectDB();


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

//Routes For authentication:
app.use('/api/auth', authRoutes);

//Routes For user management:
app.use('/api/users', userRoutes);

//Routes For article management:
app.use('/api/articles', articleRoutes);

app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});


