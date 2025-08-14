# 📦 Historique des versions

Ce document retrace l’évolution du backend du projet **Bien-Être**, en suivant une gestion de version continue.  
Chaque version introduit des évolutions, des correctifs ou des améliorations garantissant un déploiement progressif, stable et exploitable par les utilisateurs finaux.

---

## ✅ Dernière version stable

- **Version :** `v1.3.0`
- **Date :** 13 août 2025
- **Statut :** ✅ Stable – déployé sur [Render](https://dashboard.render.com/)
- **Lien GitHub :** [projet-bienetre-backend](https://github.com/alvinlucas/projet-bienetre-backend)
- **Fonctionnalité clé :**
    - Authentification Firebase
    - Gestion des vidéos (accès limité dans le temps et en nombre de vues)
    - Abonnements utilisateurs trimestriels
    - Accès administrateur (gestion des contenus)
    - Déploiement automatique via GitHub Actions

---

## 🕓 Historique des versions

### `v1.3.0` — **Déploiement final et CI/CD**
- 📦 Intégration GitHub Actions pour tests + déploiement auto Render
- 🧪 Ajout de tests unitaires pour tous les contrôleurs
- 🔐 Sécurisation Firebase / middleware JWT
- 🛠 Correction parsing de clé privée Firebase
- ✅ Logiciel pleinement exploitable et maintenable

### `v1.2.0` — **Ajout des tests & ajustements sécurité**
- 🧪 Couverture Jest > 80 %
- ✅ Fichiers `.env.test`, gestion des erreurs
- 🔒 Renforcement auth, gestion fine des accès

### `v1.1.0` — **Mise en place des routes principales**
- 🚀 Création des endpoints :
    - `/users`, `/videos`, `/abonnements`
- 🎯 Ajout des contrôleurs métiers
- 🔑 Intégration initiale Firebase + Stripe

### `v1.0.0` — **Initialisation du backend**
- 📁 Création du dépôt
- ⚙️ Setup Node.js / Express
- 🧱 Structure de base du projet (routes, services, middlewares)

---

## 🧩 Système de versioning utilisé

Le projet utilise une approche **semver** (Semantic Versioning) avec le format `MAJOR.MINOR.PATCH`.

- **MAJOR** – pour les ruptures ou nouvelles fonctionnalités majeures.
- **MINOR** – pour les ajouts de fonctionnalités sans rupture.
- **PATCH** – pour les corrections de bugs ou améliorations mineures.

---

## 🧪 Stabilité et validation utilisateur

Le projet est :
- ✅ entièrement **testé** en local et via CI,
- 🛠️ **déployé** automatiquement à chaque `push` sur `main`,
- 👤 **manipulable** par un utilisateur standard via Postman ou une interface future (frontend).

---

