const jwt = require("jsonwebtoken");
const db = require("../services/firebase");

const isAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Accès non autorisé : token manquant." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken.isAdmin) {
            return res.status(403).send({ message: "Accès refusé : vous n'êtes pas administrateur." });
        }

        req.user = decodedToken;

        next();
    } catch (error) {
        res.status(401).send({ message: "Token invalide ou expiré.", error });
    }
};

module.exports = { isAdmin };
