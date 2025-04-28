const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const routes = require('./routes/index');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'kercui',
});

global.db = db; 

db.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('✅ Connecté à MySQL (base "kercui")');
});

// Utiliser les routes
app.use('/', routes);

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});