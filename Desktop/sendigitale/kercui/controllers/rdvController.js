const db = require('../models/rdvModel');


// Vérifier la disponibilité d’un professionnel
exports.checkAvailability = (req, res) => {
    const { professionnel_id, date, heure } = req.body;
 
    const query = `
      SELECT * FROM rendezvous
      WHERE professionnel_id = ? AND date = ? AND heure = ?
    `;
 
    db.query(query, [professionnel_id, date, heure], (err, results) => {
      if (err) return res.status(500).json({ error: err });
 
      if (results.length > 0) {
        return res.status(200).json({ disponible: false, message: "Le professionnel est déjà pris." });
      } else {
        // Vérifier si une entrée existe déjà dans la table disponibilites
        const checkDispoQuery = `
          SELECT * FROM disponibilites
          WHERE professionnel_id = ? AND date = ? AND heure = ?
        `;
        
        db.query(checkDispoQuery, [professionnel_id, date, heure], (err, dispoResults) => {
          if (err) return res.status(500).json({ error: err });
          
          if (dispoResults.length > 0) {
            // Si l'entrée existe, s'assurer qu'elle est marquée comme disponible
            const updateQuery = `
              UPDATE disponibilites
              SET disponible = true
              WHERE professionnel_id = ? AND date = ? AND heure = ?
            `;
            
            db.query(updateQuery, [professionnel_id, date, heure], (err) => {
              if (err) return res.status(500).json({ error: err });
              
              return res.status(200).json({ disponible: true, message: "Le professionnel est disponible." });
            });
          } else {
            // Si l'entrée n'existe pas, la créer
            const insertQuery = `
              INSERT INTO disponibilites (professionnel_id, date, heure, disponible)
              VALUES (?, ?, ?, true)
            `;
            
            db.query(insertQuery, [professionnel_id, date, heure], (err) => {
              if (err) return res.status(500).json({ error: err });
              
              return res.status(200).json({ disponible: true, message: "Le professionnel est disponible." });
            });
          }
        });
      }
    });
};

exports.prendreRendezVous = (req, res) => {
  const { patient_id, professionnel_id, date, heure } = req.body;
  
  // Vérifier d'abord si le créneau est disponible
  const checkRdvQuery = `
    SELECT * FROM rendezvous
    WHERE professionnel_id = ? AND date = ? AND heure = ?
  `;
  
  db.query(checkRdvQuery, [professionnel_id, date, heure], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      return res.status(400).json({ message: 'Créneau non disponible, rendez-vous déjà pris' });
    }
    
    // Vérifier si le créneau existe dans la table disponibilites
    const checkDispoQuery = `
      SELECT * FROM disponibilites
      WHERE professionnel_id = ? AND date = ? AND heure = ?
    `;
    
    db.query(checkDispoQuery, [professionnel_id, date, heure], (err, dispoResults) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Si le créneau n'existe pas encore dans disponibilites, le créer
      if (dispoResults.length === 0) {
        const insertDispoQuery = `
          INSERT INTO disponibilites (professionnel_id, date, heure, disponible)
          VALUES (?, ?, ?, true)
        `;
        
        db.query(insertDispoQuery, [professionnel_id, date, heure], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          // Continuer avec la création du rendez-vous
          createRendezVous();
        });
      } else if (!dispoResults[0].disponible) {
        // Si le créneau existe mais n'est pas disponible
        return res.status(400).json({ message: 'Créneau non disponible' });
      } else {
        // Si le créneau existe et est disponible
        createRendezVous();
      }
    });
    
    function createRendezVous() {
      // Créer le rendez-vous
      const insertRdvQuery = `
        INSERT INTO rendezvous (patient_id, professionnel_id, date, heure)
        VALUES (?, ?, ?, ?)
      `;
      
      db.query(insertRdvQuery, [patient_id, professionnel_id, date, heure], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Mettre à jour la disponibilité
        const updateDispoQuery = `
          UPDATE disponibilites
          SET disponible = false
          WHERE professionnel_id = ? AND date = ? AND heure = ?
        `;
        
        db.query(updateDispoQuery, [professionnel_id, date, heure], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.status(201).json({ message: 'Rendez-vous pris avec succès' });
        });
      });
    }
  });
};


// Obtenir tous les rendez-vous d'un professionnel
exports.getRendezVousByProfessionnel = (req, res) => {
    const { professionnel_id } = req.params;
    
    const query = `
      SELECT r.id, r.patient_id, r.date, r.heure, p.nom AS patient_nom, p.prenom AS patient_prenom
      FROM rendezvous r
      JOIN patients p ON r.patient_id = p.id
      WHERE r.professionnel_id = ?
      ORDER BY r.date ASC, r.heure ASC
    `;
    
    db.query(query, [professionnel_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.status(200).json({ rendezVous: results });
    });
  };
  
  // Obtenir le détail d'un rendez-vous spécifique
  exports.getRendezVousDetail = (req, res) => {
    const { rdv_id } = req.params;
    
    const query = `
      SELECT r.id, r.patient_id, r.professionnel_id, r.date, r.heure, 
             p.nom AS patient_nom, p.prenom AS patient_prenom,
             pro.nom AS professionnel_nom, pro.prenom AS professionnel_prenom
      FROM rendezvous r
      JOIN patients p ON r.patient_id = p.id
      JOIN professionnels pro ON r.professionnel_id = pro.id
      WHERE r.id = ?
    `;
    
    db.query(query, [rdv_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      
      res.status(200).json({ rendezVous: results[0] });
    });
  };
  
  // Reprogrammer un rendez-vous
  exports.reprogrammerRendezVous = (req, res) => {
    const { rdv_id } = req.params;
    const { nouvelle_date, nouvelle_heure } = req.body;
    
    // D'abord, récupérer les informations du rendez-vous actuel
    const getQuery = `
      SELECT professionnel_id, patient_id FROM rendezvous WHERE id = ?
    `;
    
    db.query(getQuery, [rdv_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      
      const { professionnel_id, patient_id } = results[0];
      
      // Vérifier si le nouveau créneau est disponible
      const checkDispoQuery = `
        SELECT * FROM rendezvous
        WHERE professionnel_id = ? AND date = ? AND heure = ? AND id != ?
      `;
      
      db.query(checkDispoQuery, [professionnel_id, nouvelle_date, nouvelle_heure, rdv_id], (err, checkResults) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (checkResults.length > 0) {
          return res.status(400).json({ message: 'Nouveau créneau déjà occupé' });
        }
        
        // Mettre à jour l'ancienne disponibilité (la rendre disponible à nouveau)
        const getOldDateTimeQuery = `
          SELECT date, heure FROM rendezvous WHERE id = ?
        `;
        
        db.query(getOldDateTimeQuery, [rdv_id], (err, oldDateTime) => {
          if (err) return res.status(500).json({ error: err.message });
          
          const { date: ancienne_date, heure: ancienne_heure } = oldDateTime[0];
          
          const updateOldDispoQuery = `
            UPDATE disponibilites 
            SET disponible = true
            WHERE professionnel_id = ? AND date = ? AND heure = ?
          `;
          
          db.query(updateOldDispoQuery, [professionnel_id, ancienne_date, ancienne_heure], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Mettre à jour la disponibilité du nouveau créneau
            const updateNewDispoQuery = `
              INSERT INTO disponibilites (professionnel_id, date, heure, disponible)
              VALUES (?, ?, ?, false)
              ON DUPLICATE KEY UPDATE disponible = false
            `;
            
            db.query(updateNewDispoQuery, [professionnel_id, nouvelle_date, nouvelle_heure], (err) => {
              if (err) return res.status(500).json({ error: err.message });
              
              // Mettre à jour le rendez-vous
              const updateRdvQuery = `
                UPDATE rendezvous
                SET date = ?, heure = ?
                WHERE id = ?
              `;
              
              db.query(updateRdvQuery, [nouvelle_date, nouvelle_heure, rdv_id], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                
                res.status(200).json({ 
                  message: 'Rendez-vous reprogrammé avec succès',
                  rendezVous: {
                    id: rdv_id,
                    patient_id,
                    professionnel_id,
                    date: nouvelle_date,
                    heure: nouvelle_heure
                  }
                });
              });
            });
          });
        });
      });
    });
  };
  
  // Annuler un rendez-vous
  exports.annulerRendezVous = (req, res) => {
    const { rdv_id } = req.params;
    
    // Récupérer d'abord les informations du rendez-vous
    const getInfoQuery = `
      SELECT professionnel_id, date, heure FROM rendezvous WHERE id = ?
    `;
    
    db.query(getInfoQuery, [rdv_id], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
       
      if (results.length === 0) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
      
      const { professionnel_id, date, heure } = results[0];
      
      // Supprimer le rendez-vous
      const deleteQuery = `DELETE FROM rendezvous WHERE id = ?`;
      
      db.query(deleteQuery, [rdv_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Mettre à jour la disponibilité
        const updateDispoQuery = `
          UPDATE disponibilites
          SET disponible = true
          WHERE professionnel_id = ? AND date = ? AND heure = ?
        `;
        
        db.query(updateDispoQuery, [professionnel_id, date, heure], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          
          res.status(200).json({ message: 'Rendez-vous annulé avec succès' });
        });
      });
    });
  };
  
  // Vérifier les disponibilités pour la reprogrammation
  exports.getDisponibilitesProfessionnel = (req, res) => {
    const { professionnel_id, date } = req.params;
    
    // Récupérer toutes les disponibilités pour une date donnée
    const query = `
      SELECT heure, disponible FROM disponibilites
      WHERE professionnel_id = ? AND date = ?
      ORDER BY heure ASC
    `;
    
    db.query(query, [professionnel_id, date], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      // Générer les créneaux standard si aucun n'existe
      if (results.length === 0) {
        const heures = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
        const disponibilites = heures.map(heure => ({ heure, disponible: true }));
        
        res.status(200).json({ disponibilites });
      } else {
        res.status(200).json({ disponibilites: results });
      }
    });
  };