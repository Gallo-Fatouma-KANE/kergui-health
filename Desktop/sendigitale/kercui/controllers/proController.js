const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { nom, prenom, email, password, speciality, phone, profession, adresse } = req.body;
  
  try {
    // Vérifier si le professionnel existe déjà
    const checkSql = "SELECT * FROM professionnels WHERE email = ?";
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error("Erreur lors de la vérification de l'email:", err);
        return res.status(500).json({ error: "Erreur serveur" });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Professionnel déjà existant' });
      }
      
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insertion du nouveau professionnel
      const insertSql = `
        INSERT INTO professionnels 
        (nom, prenom, email, password, speciality, phone, profession, adresse) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        insertSql, 
        [nom, prenom, email, hashedPassword, speciality, phone, profession, adresse],
        (err, result) => {
          if (err) {
            console.error("Erreur lors de l'enregistrement:", err);
            return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
          }
          
          res.status(201).json({ 
            message: 'Professionnel inscrit avec succès',
            proId: result.insertId
          });
        }
      );
    });
    
  } catch (err) {
    console.error("Erreur server:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM professionnels WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erreur serveur" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      const professionnel = results[0];

      if (!professionnel.is_verified) {
        return res.status(403).json({ message: "Votre compte n'a pas encore été validé par l'administrateur." });
      }

      const isMatch = await bcrypt.compare(password, professionnel.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign({ id: professionnel.id, role: 'professionnel' }, 'SECRET_KEY', {
        expiresIn: '1d'
      });

      res.status(200).json({
        message: 'Connexion réussie',
        token,
        professionnel: {
          id: professionnel.id,
          nom: professionnel.nom,
          prenom: professionnel.prenom,
          email: professionnel.email,
          profession: professionnel.profession
        }
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  // Si tu stockes le token dans le frontend, tu peux simplement faire :
  res.status(200).json({ message: "Déconnexion réussie." });
};