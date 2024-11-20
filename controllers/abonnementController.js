const stripe = require("../services/stripe");
const db = require("../services/firebase");
const axios = require("axios");
const qs = require("qs");
const { sendEmail } = require("../services/emailService");



// Créer un abonnement
const createSubscription = async (req, res) => {
    const { email, paymentMethodId } = req.body;

    if (!email || !paymentMethodId) {
        return res.status(400).send({ message: "Email et paymentMethodId sont requis." });
    }

    try {
        // Créer ou récupérer le client Stripe
        const customer = await stripe.customers.create({
            email,
            payment_method: paymentMethodId,
            invoice_settings: { default_payment_method: paymentMethodId },
        });

        // Créer l'abonnement
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: "price_1QNJhiJnPL9GYkdXz1Mk1eMC" }], // Remplacez par l'ID du prix Stripe
            expand: ["latest_invoice.payment_intent"],
        });

        // Enregistrer l'abonnement dans Firestore
        const userRef = db.collection("utilisateurs").doc(email);
        await userRef.update({
            abonnementActif: true,
            abonnementId: subscription.id,
        });

        res.status(200).send({
            message: "Abonnement créé avec succès !",
            subscription,
        });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la création de l'abonnement.", error });
    }
};

// Annuler un abonnement
const cancelSubscription = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "L'email est requis pour annuler l'abonnement." });
    }

    try {
        // Récupérer l'utilisateur dans Firestore
        const userRef = db.collection("utilisateurs").doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).send({ message: "Utilisateur non trouvé." });
        }

        const userData = userDoc.data();

        // Vérifier si l'utilisateur a un abonnement actif
        const subscriptionId = userData.abonnementId;
        if (!userData.abonnementActif || !subscriptionId) {
            return res.status(400).send({ message: "Aucun abonnement actif trouvé pour cet utilisateur." });
        }

        // Planifier l'annulation à la fin de la période
        console.log("Planification de l'annulation de l'abonnement avec l'ID :", subscriptionId);
        const response = await axios.post(
            `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
            qs.stringify({ cancel_at_period_end: true }),
            {
                headers: {
                    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log("Abonnement mis à jour pour annulation à la fin de la période :", response.data);

        // Envoyer un email à l'utilisateur
        const subject = "Votre abonnement sera annulé à la fin de la période";
        const html = `
            <h1>Bonjour ${userData.nom || "Utilisateur"}</h1>
            <p>Nous vous confirmons que votre abonnement sera annulé à la fin de la période actuelle.</p>
            <p>Vous pourrez continuer à profiter des services jusqu'au ${new Date(response.data.current_period_end * 1000).toLocaleDateString()}.</p>
            <p>Si vous changez d'avis, vous pouvez réactiver votre abonnement depuis votre compte.</p>
            <p>Merci de votre confiance,</p>
            <p>L'équipe Bien-Être</p>
        `;

        await sendEmail(email, subject, html);

        // Mettre à jour Firestore
        await userRef.update({
            abonnementActif: true,
            abonnementAnnuleFinPeriode: true,
        });

        res.status(200).send({
            message: "Annulation planifiée avec succès à la fin de la période et email envoyé.",
            subscription: response.data,
        });
    } catch (error) {
        console.error("Erreur lors de la planification de l'annulation de l'abonnement :", error.response?.data || error.message);
        res.status(500).send({
            message: "Erreur lors de la planification de l'annulation de l'abonnement.",
            error: error.response?.data || error.message,
        });
    }
};



module.exports = { createSubscription, cancelSubscription };
