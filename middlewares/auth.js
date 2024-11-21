const db = require("../services/firebase");

const isAdmin = async (req, res, next) => {
    const { email } = req.body; // L'email de l'utilisateur doit être inclus dans la requête

    if (!email) {
        return res.status(400).send({ message: "L'email de l'administrateur est requis." });
    }

    try {
        const adminRef = db.collection("utilisateurs").doc(email);
        const adminDoc = await adminRef.get();

        if (!adminDoc.exists || !adminDoc.data().isAdmin) {
            return res.status(403).send({ message: "Accès refusé : vous n'êtes pas administrateur." });
        }

        next(); // Passe au contrôleur suivant
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la vérification des droits d'administration.", error });
    }
};

module.exports = { isAdmin };
