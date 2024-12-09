const express = require("express");
const router = express.Router();
const { createSubscription, cancelSubscription, checkSubscriptionStatus, renewSubscription, toggleAutoRenew } = require("../controllers/abonnementController");

// Route pour créer un abonnement
router.post("/create", createSubscription);

// Route pour annuler un abonnement
router.post("/cancel", cancelSubscription);

// Route pour vérifier le statut d'un abonnement
router.get("/status/:email", checkSubscriptionStatus);

// Route pour renouveler un abonnement
router.post("/renew", renewSubscription);

// Route pour activer/désactiver le renouvellement automatique
router.post("/autoRenew", toggleAutoRenew);

module.exports = router;
