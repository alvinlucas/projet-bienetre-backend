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

// Récupérer toutes les vidéos actives
const getActiveVideos = async (req, res) => {
    const user = req.user; // Supposons que l'utilisateur est authentifié et ses données sont disponibles

    try {
        const now = new Date();

        // Récupérer toutes les vidéos dont la date d'expiration n'est pas encore passée
        const videosRef = db.collection("videos");
        const snapshot = await videosRef.get();

        const videos = [];
        snapshot.forEach((doc) => {
            const video = doc.data();
            const dateExpiration = new Date(video.dateExpiration);

            // Logique de visibilité pour les abonnés
            const isVideoVisibleToUser =
                dateExpiration > now || // La vidéo n'est pas expirée
                (user.dateFinAbonnement &&
                    dateExpiration <= new Date(user.dateFinAbonnement)); // Vidéo expirée mais dans la période d'abonnement

            if (isVideoVisibleToUser) {
                videos.push(video);
            }
        });

        res.status(200).send({ videos });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des vidéos.", error });
    }
};

module.exports = { addVideo, getVideo, getActiveVideos };