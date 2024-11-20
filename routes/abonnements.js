const express = require("express");
const router = express.Router();
const { createSubscription, cancelSubscription} = require("../controllers/abonnementController");

// Route pour créer un abonnement
router.post("/create", createSubscription);

// Route pour annuler un abonnement
router.post("/cancel", cancelSubscription);

module.exports = router;
