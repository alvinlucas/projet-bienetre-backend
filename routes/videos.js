const express = require("express");
const router = express.Router();
const { addVideo, getVideo, getActiveVideos } = require("../controllers/videoController");

const { isAdmin } = require("../middlewares/auth"); // Middleware admin

// Route pour récupérer toutes les vidéos
router.get("/active", getActiveVideos);

// Route pour ajouter une vidéo (Admin uniquement)
router.post("/add", isAdmin, addVideo);

// Route pour récupérer une vidéo disponible
router.get("/:id", getVideo);


module.exports = router;
