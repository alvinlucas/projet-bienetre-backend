# Historique des versions – Backend "projet-bienetre-backend"

## v1.0.0 – Déploiement initial (13 août 2025)
- Déploiement du backend sur Render.
- Ajout du support Firebase + Stripe.
- Intégration des services : paiement, e-mail, authentification.
- Configuration des tests automatisés.
- Mise en place de l'intégration continue (CI) via GitHub Actions.

## v0.9.0 – Ajout des tests (13 août 2025)
- Ajout de tests unitaires pour :
    - les controllers (vidéos, utilisateurs, abonnements),
    - les services (Stripe, mail, Firebase),
    - le middleware `isAdmin`.

## v0.8.0 – Sécurisation de l’application (12 août 2025)
- Passage de la clé Firebase au format variable d’environnement.
- Masquage des secrets sensibles dans le code.

## v0.7.0 – Ajout des endpoints d’abonnement (21 novembre 2024)
- Routes pour `createSubscription`, `cancelSubscription`, `checkSubscriptionStatus`.

## v0.6.0 – Intégration du système de paiement (20 novembre 2024)
- Intégration de Stripe avec gestion des abonnements.
- Ajout des premières routes de paiement.

## v0.1.0 – Initialisation du projet (20 novembre 2024)
- Mise en place du backend Node.js.
- Installation des dépendances initiales.
