const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  sexe: {
    type: DataTypes.STRING,
    allowNull: false
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  numero_dossier: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  date_enregistrement: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'patients',
  timestamps: false
});

module.exports = Patient;
