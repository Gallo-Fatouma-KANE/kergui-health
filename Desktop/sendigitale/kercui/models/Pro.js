const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Professionnel = sequelize.define('Professionnel', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  speciality: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  profession: {
    type: DataTypes.STRING,
  },
  adresse: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'professionnels', // Nom réel de la table
  timestamps: false, // Sinon Sequelize crée aussi updatedAt
});

module.exports = Professionnel;
