const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gallofatouma97@gmail.com',
    pass: 'yhygpyvyxqlrjgao'
  }
});

const sendMail = async (req, res) => {
  const { destinataire, sujet, message, expediteur } = req.body;
  
  const mailOptions = {
    from: expediteur || 'gallofatouma97@gmail.com',
    to: destinataire,
    subject: sujet,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Mail envoyé à ${destinataire}`);
    res.status(200).json({ success: "Message envoyé avec succès" });
  } catch (error) {
    console.error("❌ Erreur d'envoi de mail :", error);
    res.status(500).json({ error: "Échec de l'envoi du message." });
  }
};

module.exports = sendMail;