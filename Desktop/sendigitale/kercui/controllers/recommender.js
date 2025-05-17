function getRecommendations(symptoms) {
    const recommendations = [];
  
    if (symptoms.includes('fièvre')) {
      recommendations.push("Boire beaucoup d'eau", "Consulter si la fièvre dépasse 38.5°C");
    }
  
    if (symptoms.includes('toux')) {
      recommendations.push("Prendre du sirop expectorant", "Faire un test COVID si nécessaire");
    }
  
    if (symptoms.includes('maux de tête')) {
      recommendations.push("Se reposer dans un endroit calme", "Prendre du paracétamol");
    }
  
    if (symptoms.includes('fatigue')) {
      recommendations.push("Dormir au moins 8h", "Réduire les écrans avant le coucher");
    }
  
    if (symptoms.includes('nausée')) {
      recommendations.push("Manger léger", "Éviter les odeurs fortes", "Boire du gingembre infusé");
    }
  
    if (symptoms.includes('diarrhée')) {
      recommendations.push("Boire une solution de réhydratation", "Consulter si cela dure plus de 2 jours");
    }
  
    if (symptoms.includes('douleurs musculaires')) {
      recommendations.push("Faire des étirements doux", "Prendre un anti-inflammatoire si nécessaire");
    }
  
    if (symptoms.includes('mal de gorge')) {
      recommendations.push("Gargariser avec de l'eau salée tiède", "Prendre des pastilles pour la gorge");
    }
  
    if (symptoms.includes('essoufflement')) {
      recommendations.push("Éviter l'effort physique", "Consulter un médecin immédiatement");
    }
  
    if (symptoms.includes('perte d\'appétit')) {
      recommendations.push("Manger en petites quantités", "Favoriser les aliments riches en calories");
    }
  
    if (recommendations.length === 0) {
      recommendations.push("Consulter un médecin pour un diagnostic plus précis.");
    }
  
    return recommendations;
  }
  
  module.exports = { getRecommendations };
  