const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kercui'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connecté à MySQL');
});

module.exports = db;
