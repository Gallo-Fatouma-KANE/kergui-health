const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Vérifier si l'utilisateur est un professionnel
    const checkProSql = "SELECT * FROM professionnels WHERE email = ?";
    db.query(checkProSql, [email], (err, proResults) => {
      if (err) return res.status(500).json({ error: "Erreur serveur" });

      if (proResults.length > 0) {
        const updateProSql = "UPDATE professionnels SET password = ? WHERE email = ?";
        db.query(updateProSql, [hashedPassword, email], (err) => {
          if (err) return res.status(500).json({ error: "Erreur mise à jour professionnel" });
          return res.json({ message: "Mot de passe mis à jour pour le professionnel" });
        });
      } else {
        // Sinon, vérifier si c'est un patient
        const checkPatientSql = "SELECT * FROM patients WHERE email = ?";
        db.query(checkPatientSql, [email], (err, patientResults) => {
          if (err) return res.status(500).json({ error: "Erreur serveur" });

          if (patientResults.length > 0) {
            const updatePatientSql = "UPDATE patients SET password = ? WHERE email = ?";
            db.query(updatePatientSql, [hashedPassword, email], (err) => {
              if (err) return res.status(500).json({ error: "Erreur mise à jour patient" });
              return res.json({ message: "Mot de passe mis à jour pour le patient" });
            });
          } else {
            return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
          }
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
