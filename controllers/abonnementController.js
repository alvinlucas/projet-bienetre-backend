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

        const now = new Date();
        const dateFin = new Date(subscription.current_period_end * 1000); // Date d'expiration depuis Stripe

        // Enregistrer l'abonnement dans Firestore
        const abonnementRef = db.collection("abonnements").doc(subscription.id);
        await abonnementRef.set({
            abonnementId: subscription.id,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customer.id,
            userId: email,
            type: "Trimestriel", // Exemple de type
            dateDebut: now.toISOString(),
            dateFin: dateFin.toISOString(),
            status: "Actif",
        });

        // Mettre à jour l'utilisateur avec abonnementId
        const userRef = db.collection("utilisateurs").doc(email);
        await userRef.update({
            abonnementId: subscription.id, // Associe l'abonnement à l'utilisateur
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
        const userRef = db.collection("utilisateurs").doc(email);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).send({ message: "Utilisateur non trouvé." });
        }

        const abonnementRef = db.collection("abonnements").where("userId", "==", email);
        const abonnements = await abonnementRef.get();

        if (abonnements.empty) {
            return res.status(404).send({ message: "Aucun abonnement trouvé pour cet utilisateur." });
        }

        const abonnementData = abonnements.docs[0].data();
        const subscriptionId = abonnementData.stripeSubscriptionId;
        const now = new Date();
        const dateFin = new Date(abonnementData.dateFin);

        if (!abonnementData || abonnementData.status !== "Actif") {
            return res.status(400).send({ message: "Aucun abonnement actif trouvé pour cet utilisateur." });
        }

        if (dateFin <= now) {
            await abonnements.docs[0].ref.update({ status: "Expiré" });
            return res.status(200).send({ message: "Abonnement déjà expiré et statut mis à jour." });
        }

        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        await abonnements.docs[0].ref.update({ status: "Annulation planifiée" });

        res.status(200).send({ message: "Annulation planifiée avec succès." });
    } catch (error) {
        res.status(500).send({
            message: "Erreur lors de l'annulation de l'abonnement.",
            error: error.response?.data || error.message,
        });
    }
};


const checkSubscriptionStatus = async (req, res) => {
    const { email } = req.params;

    try {
        const abonnements = await db.collection("abonnements").where("userId", "==", email).get();

        if (abonnements.empty) {
            return res.status(404).send({ message: "Aucun abonnement trouvé." });
        }

        const abonnement = abonnements.docs[0].data();
        const now = new Date();
        const dateFin = new Date(abonnement.dateFin);

        const isExpired = dateFin <= now;

        if (isExpired && abonnement.status === "Actif") {
            await abonnements.docs[0].ref.update({ status: "Expiré" });
            abonnement.status = "Expiré";
        }

        res.status(200).send({
            message: "Statut de l'abonnement récupéré avec succès.",
            type: abonnement.type,
            dateDebut: abonnement.dateDebut,
            dateFin: abonnement.dateFin,
            status: abonnement.status,
        });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la récupération du statut de l'abonnement.", error });
    }
};

const renewSubscription = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({ message: "L'email est requis pour renouveler l'abonnement." });
    }

    try {
        const abonnementRef = db.collection("abonnements").where("userId", "==", email);
        const abonnementSnapshot = await abonnementRef.get();

        if (abonnementSnapshot.empty) {
            return res.status(404).send({ message: "Aucun abonnement trouvé." });
        }

        const abonnement = abonnementSnapshot.docs[0];
        const abonnementData = abonnement.data();

        // Calculer la nouvelle date de fin
        const currentEndDate = new Date(abonnementData.dateFin);
        const newEndDate = new Date(currentEndDate);
        newEndDate.setMonth(newEndDate.getMonth() + 3); // Ajouter 3 mois (ou la durée de l'abonnement)

        // Mettre à jour la date de fin uniquement
        await abonnement.ref.update({
            dateFin: newEndDate.toISOString(),
        });

        res.status(200).send({
            message: "Abonnement renouvelé avec succès.",
            updatedAbonnement: {
                ...abonnementData,
                dateFin: newEndDate.toISOString(),
            },
        });
    } catch (error) {
        res.status(500).send({
            message: "Erreur lors du renouvellement de l'abonnement.",
            error,
        });
    }
};


const toggleAutoRenew = async (req, res) => {
    const { email, autoRenew } = req.body;

    if (!email || autoRenew === undefined) {
        return res.status(400).send({ message: "Email et autoRenew sont requis." });
    }

    try {
        const abonnementRef = db.collection("abonnements").where("userId", "==", email);
        const abonnements = await abonnementRef.get();

        if (abonnements.empty) {
            return res.status(404).send({ message: "Aucun abonnement trouvé." });
        }

        await abonnements.docs[0].ref.update({ autoRenew });
        res.status(200).send({ message: "Renouvellement automatique mis à jour." });
    } catch (error) {
        res.status(500).send({ message: "Erreur lors de la mise à jour du renouvellement automatique.", error });
    }
};





module.exports = { createSubscription, cancelSubscription, checkSubscriptionStatus, renewSubscription, toggleAutoRenew };
