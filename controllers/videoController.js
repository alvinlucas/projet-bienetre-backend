const db = require("../services/firebase");

// Ajouter une vidéo
const addVideo = async (req, res) => {
    const { titre, description, url, datePublication } = req.body;

    // Vérifiez les champs requis
    if (!titre || !description || !url || !datePublication) {
        return res.status(400).send({ message: "Titre, description, URL et date de publication sont requis." });
    }

    try {
        // Vérifiez si l'utilisateur est un administrateur (par sécurité supplémentaire)
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).send({ message: "Accès refusé : vous n'êtes pas administrateur." });
        }

        // Calculez les dates de publication et d'expiration
        const publicationDate = new Date(datePublication);
        const expirationDate = new Date(publicationDate);
        expirationDate.setMonth(expirationDate.getMonth() + 1); // Ajouter un mois à la date de publication

        // Enregistrez la vidéo dans Firestore
        const videoRef = db.collection("videos").doc();
        await videoRef.set({
            id: videoRef.id,
            titre,
            description,
            url,
            datePublication: publicationDate.toISOString().split("T")[0],
            dateExpiration: expirationDate.toISOString().split("T")[0],
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
    try {
        const now = new Date();

        // Récupérer toutes les vidéos non expirées
        const videosRef = db.collection("videos");
        const snapshot = await videosRef.get();

        const videos = [];
        snapshot.forEach((doc) => {
            const video = doc.data();
            const dateExpiration = new Date(video.dateExpiration);
            const datePublication = new Date(video.datePublication);

            // Ne renvoyer que les vidéos publiées et non expirées
            if (dateExpiration > now && datePublication <= now) {
                videos.push(video);
            }
        });

        res.status(200).send({ videos });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération des vidéos.", error });
    }
};

// Supprimer une vidéo
const deleteVideo = async (req, res) => {
    const { id } = req.params;

    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).send({ message: "Accès refusé : vous n'êtes pas administrateur." });
        }

        const videoRef = db.collection("videos").doc(id);
        const videoDoc = await videoRef.get();

        if (!videoDoc.exists) {
            return res.status(404).send({ message: "Vidéo non trouvée." });
        }

        await videoRef.delete();
        res.status(200).send({ message: "Vidéo supprimée avec succès !" });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la suppression de la vidéo.", error });
    }
};

// Modifier une vidéo
const updateVideo = async (req, res) => {
    const { id } = req.params;
    const { titre, description, url, datePublication } = req.body;

    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).send({ message: "Accès refusé : vous n'êtes pas administrateur." });
        }

        const videoRef = db.collection("videos").doc(id);
        const videoDoc = await videoRef.get();

        if (!videoDoc.exists) {
            return res.status(404).send({ message: "Vidéo non trouvée." });
        }

        const updatedData = {};

        if (titre) updatedData.titre = titre;
        if (description) updatedData.description = description;
        if (url) updatedData.url = url;
        if (datePublication) {
            const publicationDate = new Date(datePublication);
            const expirationDate = new Date(publicationDate);
            expirationDate.setMonth(expirationDate.getMonth() + 1);

            updatedData.datePublication = publicationDate.toISOString().split("T")[0];
            updatedData.dateExpiration = expirationDate.toISOString().split("T")[0];
        }

        await videoRef.update(updatedData);
        res.status(200).send({ message: "Vidéo modifiée avec succès !" });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la modification de la vidéo.", error });
    }
};

module.exports = { addVideo, getVideo, getActiveVideos, deleteVideo, updateVideo };