//App.js

const express = require('express');


const app = express();


// CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use((req, res) => {
  res.json({ message: 'test !' });
});
//permet de lire le corps de la requête d'un objet JSON entrant pour rendre l'objet utilisable.cette fonction est utilisé sur toutes les routes de l'API

app.use(express.json());


module.exports = app;