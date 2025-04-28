// emailController.js
require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuration du transporteur avec le mot de passe d'application
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'gallofatouma97@gmail.com',
    pass: process.env.EMAIL_PASS || 'yhygpyvyxqlrjgao'
  }
});

// Fonction d'envoi d'email pour la route
const sendMail = async (req, res) => {
  try {
    const { expediteur, destinataire, sujet, message } = req.body;
    
    // Vérifier si les champs requis sont présents
    if (!destinataire || !sujet || !message) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const mailOptions = {
      from: expediteur || 'gallofatouma97@gmail.com',
      to: destinataire,
      subject: sujet,
      text: message
    };

    // Tentative d'envoi
    await transporter.sendMail(mailOptions);
    console.log(`✅ Mail envoyé à ${destinataire}`);
    return res.status(200).json({ success: "Message envoyé avec succès" });
  } catch (error) {
    console.error("❌ Erreur d'envoi de mail:", error);
    return res.status(500).json({ error: "Échec de l'envoi du message." });
  }
};

module.exports = { sendMail };