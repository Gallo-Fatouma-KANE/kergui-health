const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('kercui', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

sequelize.authenticate()
  .then(() => console.log('✅ Connexion à MySQL réussie avec Sequelize'))
  .catch(err => console.error('❌ Erreur de connexion :', err));

module.exports = sequelize;
