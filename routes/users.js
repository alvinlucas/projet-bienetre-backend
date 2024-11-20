const express = require("express");
const router = express.Router();
const { createUser, loginUser } = require("../controllers/userController");

// Route d'inscription
router.post("/inscription", createUser);

// Route de connexion
router.post("/connexion", loginUser);

module.exports = router;
