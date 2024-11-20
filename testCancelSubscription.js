const Stripe = require("stripe");
const stripe = Stripe("sk_test_51QNJCpJnPL9GYkdXgLVT0qsiD7EePKWYgUT7SbpLnH3whegrBznaL8aubFux3HtuC8a7j0N9Mpk90ci9QJcSY18N00IHm8px97");

(async () => {
    try {
        const subscriptionId = "sub_1QNJrCJnPL9GYkdX1hesieAq"; // Remplacez par l'ID de votre abonnement
        const canceledSubscription = await stripe.subscriptions['delete'](subscriptionId);
        console.log("Abonnement annulé :", canceledSubscription);
    } catch (error) {
        console.error("Erreur lors de l'annulation :", error.message || error);
    }
})();
