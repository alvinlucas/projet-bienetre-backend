# 📘 Manuel d’Utilisation – Backend Bien-Être

Ce manuel décrit comment interagir avec l’API via Postman ou tout autre outil HTTP. Il détaille les routes disponibles, les accès, et des exemples d’appels.

---

## 🔐 Authentification

Certaines routes nécessitent un **token JWT** dans l’en-tête `Authorization`. Pour l’obtenir :
1. Effectuer une requête POST à `/api/users/connexion`.
2. Copier le token depuis la réponse.
3. Ajouter dans l'en-tête de vos requêtes :

```
Authorization: Bearer <VOTRE_TOKEN_ICI>
```

---

## 👤 1. Gestion des Utilisateurs

### ✅ Inscription

- **Méthode** : `POST`
- **URL** : `/api/users/inscription`
- **Body (JSON)** :
```json
{
  "nom": "Lucas",
  "prenom": "Alvin",
  "email": "test@example.com",
  "password": "motdepasse",
  "pseudo": "alvinlucas"
}
```
- **Accès** : Public
- **Réponse attendue** : `201 Created`

---

### 🔑 Connexion

- **Méthode** : `POST`
- **URL** : `/api/users/connexion`
- **Body (JSON)** :
```json
{
  "identifiant": "test@example.com",
  "password": "motdepasse"
}
```
- **Réponse attendue** : 
```json
{
  "message": "Connexion réussie !",
  "user": { ... },
  "token": "jwt_token"
}
```

---

## 🎫 2. Gestion des Abonnements

### 🧾 Créer un abonnement

- **Méthode** : `POST`
- **URL** : `/api/subscriptions/create`
- **Body (JSON)** :
```json
{
  "email": "test@example.com",
  "paymentMethodId": "pm_card_visa"
}
```
- **Accès** : Utilisateur
- **Réponse attendue** : Détails de l’abonnement

---

### ❌ Annuler un abonnement

- **Méthode** : `POST`
- **URL** : `/api/subscriptions/cancel`
- **Body (JSON)** :
```json
{ "email": "test@example.com" }
```

---

### 📅 Consulter l’état d’abonnement

- **Méthode** : `GET`
- **URL** : `/api/subscriptions/status/test@example.com`

---

### 🔁 Renouveler un abonnement

- **Méthode** : `POST`
- **URL** : `/api/subscriptions/renew`
- **Body** :
```json
{ "email": "test@example.com" }
```

---

### 🔄 Activer/Désactiver renouvellement automatique

- **Méthode** : `POST`
- **URL** : `/api/subscriptions/autoRenew`
- **Body** :
```json
{
  "email": "test@example.com",
  "autoRenew": true
}
```

---

## 🎥 3. Gestion des Vidéos

### 📺 Voir les vidéos actives

- **Méthode** : `GET`
- **URL** : `/api/videos/active`
- **Réponse** :
```json
{
  "videos": [ ... ]
}
```

---

### 🔎 Obtenir une vidéo par ID

- **Méthode** : `GET`
- **URL** : `/api/videos/<id_de_la_video>`

---

### ➕ Ajouter une vidéo (Admin uniquement)

- **Méthode** : `POST`
- **URL** : `/api/videos/add`
- **Headers** :
```http
Authorization: Bearer <token_admin>
```
- **Body** :
```json
{
  "titre": "Cours de Yoga",
  "description": "Relaxation profonde",
  "url": "https://youtube.com/video123",
  "datePublication": "2025-08-01T00:00:00Z"
}
```

---

### 🗑 Supprimer une vidéo (Admin)

- **Méthode** : `DELETE`
- **URL** : `/api/videos/<id>`
- **Headers** :
```http
Authorization: Bearer <token_admin>
```

---

### 📝 Modifier une vidéo (Admin)

- **Méthode** : `PUT`
- **URL** : `/api/videos/<id>`
- **Headers** :
```http
Authorization: Bearer <token_admin>
```
- **Body** (partiel possible) :
```json
{
  "titre": "Cours modifié",
  "description": "Nouveau contenu",
  "url": "https://youtube.com/newurl"
}
```

---

## 📊 Récapitulatif des Accès

| Route                                | Méthode | Accès          |
|-------------------------------------|---------|----------------|
| `/api/users/inscription`            | POST    | Public         |
| `/api/users/connexion`              | POST    | Public         |
| `/api/subscriptions/*`              | POST/GET| Utilisateur    |
| `/api/videos/active`                | GET     | Public         |
| `/api/videos/:id`                   | GET     | Public         |
| `/api/videos/add`                   | POST    | Admin          |
| `/api/videos/:id` (DELETE / PUT)    | DELETE / PUT | Admin   |

---

## ✅ Exemple d’appel Postman

- Sélectionner méthode : `POST`
- URL : `http://localhost:10000/api/users/connexion`
- Body : JSON (raw)
- Ajouter Header `Content-Type: application/json`
- Pour les routes protégées : ajouter `Authorization: Bearer <token>`

