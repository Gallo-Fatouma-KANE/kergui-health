const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const {
    nom,
    prenom,
    date_naissance,
    sexe,
    adresse,
    telephone,
    email,
    password
  } = req.body;

  // Validation basique
  if (!nom || !prenom || !date_naissance || !sexe || !adresse || !telephone || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const numero_dossier = `DOS-${Date.now()}`; 
    const date_enregistrement = new Date();

    const sql = `
      INSERT INTO patients (
        nom, prenom, date_naissance, sexe, adresse, telephone, email, numero_dossier, date_enregistrement, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    db.query(sql, [
      nom, prenom, date_naissance, sexe, adresse, telephone, email, numero_dossier, date_enregistrement, hashedPassword
    ], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement:', err);
        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement du patient' });
      }

      res.status(201).json({
        message: 'Patient enregistré avec succès',
        patientId: result.insertId
      });
    });

  } catch (error) {
    console.error('Erreur serveur :', error);
    return res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validation basique
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe sont requis' });
  }

  const sql = 'SELECT * FROM patients WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche du patient :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const patient = results[0];

    // Comparaison du mot de passe
    const match = await bcrypt.compare(password, patient.password);

    if (!match) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Si le mot de passe est correct
    res.status(200).json({
      message: 'Connexion réussie',
      patient: {
        id: patient.id,
        nom: patient.nom,
        prenom: patient.prenom,
        email: patient.email,
        numero_dossier: patient.numero_dossier
      }
    });
  });
};

exports.logout = async (req, res) => {
  // Si tu stockes le token dans le frontend, tu peux simplement faire :
  res.status(200).json({ message: "Déconnexion réussie." });
};
