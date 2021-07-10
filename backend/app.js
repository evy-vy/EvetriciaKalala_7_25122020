//App.js

require('dotenv').config();
const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');


const app = express();
app.use(helmet());

// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Vous avez atteint le nombre de tentative de connexion, veulliez rééssayer dans une heure'
});

app.use('/api', limiter);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/post', postRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
