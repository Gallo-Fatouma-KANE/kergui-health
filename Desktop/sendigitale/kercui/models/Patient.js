const mysql = require('mysql2');

const patientSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  name: String,
  email: { type: String, unique: true },
  date_naissance: date_naissance,
  sexe: String,
  adresse: String,
  telephone: String,
  password: String
});

module.exports = mongoose.model('Patient', patientSchema);
