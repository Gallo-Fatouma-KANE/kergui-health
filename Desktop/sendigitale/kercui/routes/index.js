const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const proController = require('../controllers/proController');
const authController = require('../controllers/authController');
const messageController = require('../controllers/messageController');
const adminController = require('../controllers/adminController');
// Routes patient
router.post('/patient/register', patientController.register);
router.post('/patient/login', patientController.login);
router.post('/patient/logout', patientController.logout);
// Routes professionnel
router.post('/professionnel/register', proController.register);
router.post('/professionnel/login', proController.login);
router.post('/professionnel/logout', proController.logout);

router.post('/reset-password', authController.resetPassword);
router.post('/envoyer-message', messageController.sendMail);
// liste professionnel sans valider
router.get('/pending-professionals', adminController.getPendingProfessionals);

router.put('/validate-professional/:id', adminController.validateProfessional);
router.delete('/patients/:id', adminController.deletePatient);
router.delete('/professionnels/:id', adminController.deleteProfessional);
// Ajouter un nouvel admin
router.post('/admins', adminController.addAdmin);
// Supprimer un admin
router.delete('/admins/:id', adminController.deleteAdmin);

module.exports = router;