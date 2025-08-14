# 📦 Manuel de Déploiement – Backend Bien-Être

## 🛠️ Prérequis

Avant d’installer ou déployer le backend, assurez-vous d’avoir :

- [Node.js (version 18 ou supérieure)](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
- Un compte [Render.com](https://render.com/) si déploiement sur Render
- Une clé Firebase d'administration (fichier `serviceAccountKey.json`)

## 🧰 Installation locale (en développement)

### 1. Cloner le projet

```bash
git clone https://github.com/alvinlucas/projet-bienetre-backend.git
cd projet-bienetre-backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d’environnement

Créer un fichier `.env` à la racine du projet :

```env
PORT=5000
STRIPE_SECRET_KEY=your_stripe_key
FIREBASE_KEY_JSON={"type":"service_account",...}  # ⚠️ à mettre sur une seule ligne (clé JSON échappée)
JWT_SECRET=your_jwt_secret
EMAIL_USER=adressemail@gmail.com
EMAIL_PASS=your_email_password
RENDER_EXTERNAL_URL=https://ton-backend.onrender.com
```

> 💡 La variable `FIREBASE_KEY_JSON` contient la clé d’administration Firebase **échappée** (avec `\n` pour les sauts de ligne).

### 4. Lancer le serveur

```bash
npm start
```

> Le serveur démarre sur `http://localhost:5000`

## 🚀 Déploiement sur Render

### 1. Créer un nouveau service Web

- Aller sur [https://dashboard.render.com](https://dashboard.render.com)
- Créer un nouveau Web Service depuis ton dépôt GitHub

### 2. Renseigner les variables d’environnement

Dans l’onglet **Environment**, ajouter les mêmes variables que dans le fichier `.env`.

### 3. Démarrage automatique

Render exécute automatiquement `npm install` puis `npm start` après chaque push sur la branche principale.

### 4. Webhook GitHub (optionnel)

Un webhook peut être configuré pour redéployer automatiquement le backend à chaque `git push`.

---

## ✅ Vérification du bon fonctionnement

- Accès à l’URL Render du backend : `https://ton-backend.onrender.com/api`
- Tous les endpoints doivent répondre (cf. `manuel_utilisation.md`)
- Les tests peuvent être lancés localement :

```bash
npm test
```