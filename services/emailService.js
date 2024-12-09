const nodemailer = require("nodemailer");
require("dotenv").config();

// Configuration du transporteur
const transporter = nodemailer.createTransport({
    service: "gmail", // Vous pouvez remplacer par un autre service (Outlook, Yahoo, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Votre email
        pass: process.env.EMAIL_PASS, // Votre mot de passe ou mot de passe d'application
    },
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // L'email expéditeur
            to, // L'email du destinataire
            subject, // Le sujet de l'email
            html, // Le contenu HTML
        };

        const info = await transporter.sendMail(mailOptions);
    } catch (error) {
        throw error;
    }
};

module.exports = { sendEmail };
