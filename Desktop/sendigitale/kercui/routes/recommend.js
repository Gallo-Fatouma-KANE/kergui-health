const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommender');

router.post('/recommend', (req, res) => {
  const { symptoms } = req.body;

  if (!Array.isArray(symptoms)) {
    return res.status(400).json({ error: 'symptoms doit être un tableau' });
  }

  const result = getRecommendations(symptoms);
  return res.json({ recommendations: result });
});

module.exports = router;
