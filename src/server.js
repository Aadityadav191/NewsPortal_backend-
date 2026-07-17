const express = require ('express');
const app = express();
const dotenv = require('dotenv');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const {connectDB} = require('./config/db');
// const authRoutes = require('./routes/auth.routes');
const authorsRoutes = require('./routes/authors.routes');
const adminRoutes = require('./routes/admin.routes');
const superadminRoutes =require('./routes/superadmin.routes')


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

app.use('/api/authors', authorsRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/superadmin',superadminRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


