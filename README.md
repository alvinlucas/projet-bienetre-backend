
# 🌿 Backend - Projet Bien-Être

Ce dépôt contient le backend du projet **Bien-Être**, une plateforme de cours de yoga en ligne avec gestion des utilisateurs, vidéos, abonnements et paiements via Stripe.

## 📁 Sommaire

- [📦 Installation locale](#-installation-locale)
- [⚙️ Configuration (.env & Firebase)](#️-configuration-env--firebase)
- [🚀 Lancement du projet](#-lancement-du-projet)
- [📚 Documentation](#-documentation)
- [🛠 Technologies](#-technologies)
- [📜 Licence](#-licence)

---

## 📦 Installation locale

1. Clone ce dépôt :
   ```bash
   git clone https://github.com/alvinlucas/projet-bienetre-backend.git
   cd projet-bienetre-backend
   ```

2. Installe les dépendances :
   ```bash
   npm install
   ```

---

## ⚙️ Configuration (.env & Firebase)

### `.env` requis

Crée un fichier `.env` à la racine du projet avec les variables suivantes (⚠️ remplace les valeurs) :

```env
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX
EMAIL_USER=ton-email@gmail.com
EMAIL_PASS=mot-de-passe-app
JWT_SECRET=une-clé-secrète-longue-et-unique
```

> Ne versionne jamais ce fichier. Ces données sont **sensibles**.

---

### `serviceAccountKey.json` (Firebase Admin SDK)

Crée un fichier `serviceAccountKey.json` à la racine du projet :

```json
{
  "type": "service_account",
  "project_id": "ton-projet-firebase",
  "private_key_id": "xxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk@ton-projet.iam.gserviceaccount.com",
  "client_id": "xxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

> Ces informations sont fournies depuis la console Firebase dans Paramètres du projet > Comptes de service.

---

## 🚀 Lancement du projet

```bash
npm start
```

Par défaut, l'application démarre sur le port `5000`.

---

## 📚 Documentation

📄 Tous les fichiers de documentation se trouvent à la racine ou dans le dossier `/documentation` (à créer si besoin) :

- [`📘 cahier_recettes.md`](./cahier_recettes.md) — Scénarios de tests + résultats attendus.
- [`📘 manuel_deploiement.md`](./manuel_deploiement.md) — Instructions d'installation & déploiement.
- [`📘 manuel_utilisation.md`](./manuel_utilisation.md) — Appels API avec Postman + rôles.
- [`📘 manuel_mise_a_jour.md`](./manuel_mise_a_jour.md) — Mise à jour des dépendances & redéploiement.
- [`📘 bugfixes.md`](./bugfixes.md) — Liste des bugs corrigés & améliorations proposées.
- [`📘 version.md`](./version.md) — Historique des versions.

---

## 🛠 Technologies

- Node.js / Express
- Firebase Admin SDK (authentification)
- Stripe (paiement)
- Nodemailer (envoi d’e-mails)
- Jest / Supertest (tests)


