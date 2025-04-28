const bcrypt = require('bcryptjs');

const Admin = {
  // Créer un nouvel admin
  create: async (nom, prenom, email, motDePasse) => {
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    return new Promise((resolve, reject) => {
      global.db.query(
        'INSERT INTO admin (nom, prenom, email, mot_de_passe) VALUES (?, ?, ?, ?)',
        [nom, prenom, email, hashedPassword],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // Trouver un admin par email
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      global.db.query('SELECT * FROM admin WHERE email = ?', [email], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Trouver un admin par ID
  findById: (id) => {
    return new Promise((resolve, reject) => {
      global.db.query('SELECT * FROM admin WHERE id = ?', [id], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]);
      });
    });
  },

  // Supprimer un admin par ID
  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      global.db.query('DELETE FROM admin WHERE id = ?', [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // Voir tous les admins
  findAll: () => {
    return new Promise((resolve, reject) => {
      global.db.query('SELECT * FROM admin', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
};

module.exports = Admin;