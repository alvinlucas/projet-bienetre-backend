# 🐛 Fichier des bugs corrigés et améliorations (`bugfixes.md`)

## Objectif
Ce fichier documente les anomalies détectées durant la phase de recette ainsi que les actions correctives apportées pour garantir un fonctionnement conforme aux attentes du projet.


---

## ✅ Bugs corrigés

### 1. Problème : Mauvais parsing de la clé privée Firebase dans les tests
- **Comportement observé :** Les tests échouaient avec l'erreur `Invalid PEM formatted message`.
- **Analyse :** Le contenu de la variable `FIREBASE_KEY_JSON` n'était pas correctement échappé, causant une erreur lors de l'initialisation Firebase.
- **Correction :** Ajout d'un bloc `try/catch` pour tenter un `JSON.parse()` classique puis en remplaçant `\n` par `
`.
- **Fichier :** `services/firebase.js`

### 2. Problème : Tests Jest échouaient par absence de configuration d'environnement
- **Comportement observé :** Tests relatifs aux routes utilisateurs, vidéos et abonnements échouaient.
- **Analyse :** Les variables d’environnement nécessaires (dont `FIREBASE_KEY_JSON`) n'étaient pas présentes dans le contexte de test.
- **Correction :** Ajout d’un fichier `.env.test` ou injection manuelle des variables via GitHub Actions ou en local avec `dotenv/config`.

### 3. Problème : Non-détection de certains headers d'authentification
- **Comportement observé :** Des requêtes échouaient à l'étape de vérification du token JWT Firebase.
- **Analyse :** Le middleware cherchait uniquement `Authorization`, sans fallback.
- **Correction :** Ajout d’un contrôle plus robuste et retour d'erreur explicite en cas de token manquant ou invalide.
- **Fichier :** `middlewares/auth.js`

---

## 🔧 Améliorations proposées

### 🔒 Sécurité
- Validation renforcée des entrées dans les endpoints sensibles (ex : `/videos`, `/abonnements`).
- Ajout de tests de sécurité simulant des accès non autorisés.

### 🧪 Tests
- Refactor des tests avec de meilleures séparations (authentification, erreurs, cas limites).
- Ajout de tests structurels pour Firebase et Stripe.
