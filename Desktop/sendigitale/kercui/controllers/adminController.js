const Admin = require('../models/Admin');

// Exemple pour ajouter un admin
exports.addAdmin = async (req, res) => {
  const { nom, prenom, email, motDePasse } = req.body;
  try {
    const adminExistant = await Admin.findByEmail(email);
    if (adminExistant) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }
    await Admin.create(nom, prenom, email, motDePasse);
    res.status(201).json({ message: 'Nouvel admin ajouté !' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.deleteAdmin = (req, res) => {
  const { id } = req.params;
  console.log("Attempting to delete admin with ID:", id);
  const sql = "DELETE FROM admin WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }
    res.status(200).json({ message: `Admin supprimé avec succès ${id}` });
  });
};


exports.getPendingProfessionals = (req, res) => {
    const sql = "SELECT * FROM professionnels WHERE is_verified = false";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      res.status(200).json(results);
    });
  };
  exports.validateProfessional = (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE professionnels SET is_verified = true WHERE id = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Professionnel non trouvé" });
      }
      res.status(200).json({ message: "Professionnel validé avec succès" });
    });
  };

  exports.deletePatient = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM patients WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Patient non trouvé" });
      }
      res.status(200).json({ message: "Patient supprimé avec succès" });
    });
  };
  exports.deleteProfessional = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM professionnels WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Professionnel non trouvé" });
      }
      res.status(200).json({ message: "Professionnel supprimé avec succès" });
    });
  };
    
    