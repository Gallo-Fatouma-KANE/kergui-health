const mysql = require('mysql2');

const proSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  password: String,
  speciality: String,
  phone: String,
  profession: String,
  adresse: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pro', proSchema);
