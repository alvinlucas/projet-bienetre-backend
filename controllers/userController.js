const bcrypt = require("bcrypt");
const db = require("../services/firebase");

// Fonction pour valider l'email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Fonction pour valider le mot de passe
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Inscription d'un utilisateur
const createUser = async (req, res) => {
    const { nom, prenom, email, password, pseudo } = req.body;

    if (!nom || !prenom || !email || !password || !pseudo) {
        return res.status(400).send({ message: "Tous les champs sont requis : nom, prénom, email, mot de passe, pseudo." });
    }

    if (!isValidEmail(email)) {
        return res.status(400).send({ message: "Adresse e-mail invalide." });
    }

    if (!isValidPassword(password)) {
        return res.status(400).send({
            message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial."
        });
    }

    try {
        // Vérification de l'existence de l'email ou du pseudo
        const emailExists = await db.collection("utilisateurs").doc(email).get();
        const pseudoQuery = await db.collection("utilisateurs").where("pseudo", "==", pseudo).get();

        if (emailExists.exists) {
            return res.status(400).send({ message: "Cet email est déjà utilisé." });
        }
        if (!pseudoQuery.empty) {
            return res.status(400).send({ message: "Ce pseudo est déjà utilisé." });
        }

        // Hachage du mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Sauvegarde de l'utilisateur avec le mot de passe haché
        const userRef = db.collection("utilisateurs").doc(email);
        await userRef.set({
            nom,
            prenom,
            email,
            password: hashedPassword,
            pseudo,
            abonnementActif: false,
        });

        res.status(201).send({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la création de l'utilisateur.", error });
    }
};

// Connexion d'un utilisateur
const loginUser = async (req, res) => {
    const { identifiant, password } = req.body;

    if (!identifiant || !password) {
        return res.status(400).send({ message: "Identifiant (email ou pseudo) et mot de passe sont requis." });
    }

    try {
        let userDoc;

        if (identifiant.includes("@")) {
            const userRef = db.collection("utilisateurs").doc(identifiant);
            userDoc = await userRef.get();
        } else {
            const pseudoQuery = await db.collection("utilisateurs").where("pseudo", "==", identifiant).get();
            if (!pseudoQuery.empty) {
                userDoc = pseudoQuery.docs[0];
            }
        }

        if (!userDoc || !userDoc.exists) {
            return res.status(404).send({ message: "Utilisateur non trouvé." });
        }

        const userData = userDoc.data();

        // Comparaison du mot de passe avec bcrypt
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Mot de passe incorrect." });
        }

        res.status(200).send({ message: "Connexion réussie !", data: userData });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la connexion.", error });
    }
};

module.exports = { createUser, loginUser };
