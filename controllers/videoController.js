const db = require("../services/firebase");

// Ajouter une vidéo
const addVideo = async (req, res) => {
    const { titre, description, url } = req.body;

    if (!titre || !description || !url) {
        return res.status(400).send({ message: "Titre, description et URL sont requis." });
    }

    try {
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        const videoRef = db.collection("videos").doc();
        await videoRef.set({
            id: videoRef.id,
            titre,
            description,
            url,
            datePublication: now.toISOString().split("T")[0],
            dateExpiration: oneMonthLater.toISOString().split("T")[0],
            viewCounts: {},
        });

        res.status(201).send({ message: "Vidéo ajoutée avec succès !" });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de l'ajout de la vidéo.", error });
    }
};

// Récupérer une vidéo
const getVideo = async (req, res) => {
    const { id } = req.params;

    try {
        const videoRef = db.collection("videos").doc(id);
        const videoDoc = await videoRef.get();

        if (!videoDoc.exists) {
            return res.status(404).send({ message: "Vidéo non trouvée." });
        }

        const videoData = videoDoc.data();

        res.status(200).send({ message: "Vidéo récupérée avec succès.", video: videoData });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération de la vidéo.", error });
    }
};

module.exports = { addVideo, getVideo };
