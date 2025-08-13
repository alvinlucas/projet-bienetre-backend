const express = require("express");
const router = express.Router();
const { addVideo, getVideo, getActiveVideos, deleteVideo, updateVideo } = require("../controllers/videoController");

const { isAdmin } = require("../middlewares/auth"); // Middleware admin

// Route pour récupérer toutes les vidéos
router.get("/active", getActiveVideos);

// Route pour ajouter une vidéo (Admin uniquement)
router.post("/add", isAdmin, addVideo);

// Route pour récupérer une vidéo disponible
router.get("/:id", getVideo);

// Route pour supprimer une vidéo (Admin uniquement)
router.delete("/:id", isAdmin, deleteVideo);

// Route pour mettre à jour une vidéo (Admin uniquement)
router.put("/:id", isAdmin, updateVideo);

module.exports = router;
