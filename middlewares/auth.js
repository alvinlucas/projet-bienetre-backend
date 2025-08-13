const jwt = require("jsonwebtoken");
const db = require("../services/firebase");

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Accès non autorisé : token manquant." });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Vérifiez et décodez le token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifiez si isAdmin est défini dans le token
        if (!decodedToken.isAdmin) {
            return res.status(403).send({ message: "Accès refusé : vous n'êtes pas administrateur." });
        }

        // Ajoutez les informations utilisateur au req pour les contrôleurs suivants
        req.user = decodedToken;

        next(); // Passe au contrôleur suivant
    } catch (error) {
        res.status(401).send({ message: "Token invalide ou expiré.", error });
    }
};

module.exports = { isAdmin };
