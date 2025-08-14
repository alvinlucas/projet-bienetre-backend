# 📒 Cahier de Recettes – Backend "projet-bienetre"

## 🎯 Fonctionnalités attendues

Ce backend permet aux utilisateurs de s’abonner à des cours de yoga en ligne avec des règles précises d’accès aux contenus.  
Les fonctionnalités principales sont :

1. **Authentification des utilisateurs**
    - Connexion avec token JWT
    - Rôles utilisateur / administrateur

2. **Gestion des vidéos (par l’admin uniquement)**
    - Ajout, suppression et listing des vidéos
    - Limite de 3 visionnages par vidéo par utilisateur
    - Limite de validité : 1 mois après ajout

3. **Gestion des abonnements**
    - Création d’un abonnement via Stripe
    - Vérification de la validité de l’abonnement
    - Décompte des cours visionnés

4. **Middleware de sécurité**
    - Vérification du rôle admin
    - Protection des routes via JWT

5. **Notifications par email**
    - Envoi d’email à l’utilisateur (confirmation, rappel, etc.)

6. **Tests automatisés**
    - Tests fonctionnels, structurels et de sécurité via Jest et GitHub Actions

---

## 🔧 Contexte technique

- **Backend** : Node.js (Express)
- **Base de données** : Firestore (Firebase)
- **Paiement** : Stripe
- **Authentification** : JWT
- **Tests** : Jest + Supertest
- **CI** : GitHub Actions (`tests.yml`)

---

## ✅ Fonctionnalités testées

### 1. Authentification

| Scénario | Donnée d'entrée | Résultat attendu |
|---------|------------------|------------------|
| ✅ Connexion avec bon email et mot de passe | `{ email, motDePasse }` | `200 OK`, token JWT renvoyé |
| ✅ Connexion avec mauvais mot de passe | `{ email, mauvaisMotDePasse }` | `401 Unauthorized`, message d'erreur |
| ✅ Connexion sans email | `{ motDePasse }` | `400 Bad Request`, message d'erreur |

---

### 2. Accès protégé par rôle (middleware `isAdmin`)

| Scénario | Donnée d'entrée | Résultat attendu |
|---------|------------------|------------------|
| ✅ Accès avec token admin valide | `Authorization: Bearer <token_admin>` | `200 OK`, accès autorisé |
| ✅ Accès avec token utilisateur non admin | `Authorization: Bearer <token_user>` | `403 Forbidden`, accès refusé |

---

### 3. Gestion des vidéos (Admin uniquement)

| Scénario | Donnée d'entrée | Résultat attendu |
|---------|------------------|------------------|
| ✅ Ajout vidéo valide | `{ titre, description, lien }` + token admin | `201 Created`, vidéo ajoutée |
| ✅ Récupération des vidéos | `GET /videos` | `200 OK`, tableau de vidéos |
| ✅ Suppression d'une vidéo | `DELETE /videos/:id` avec token admin | `200 OK`, vidéo supprimée |

---

### 4. Gestion des abonnements

| Scénario | Donnée d'entrée | Résultat attendu |
|---------|------------------|------------------|
| ✅ Création d’un abonnement Stripe | `{ userId, email, name }` | `200 OK`, URL Stripe renvoyée |
| ✅ Vérification statut abonnement actif | `userId` | `200 OK`, `{ isActive: true/false, remainingCourses: number }` |

---

### 5. Limites de visionnage et date de validité

| Scénario | Donnée d'entrée | Résultat attendu |
|---------|------------------|------------------|
| ✅ Accès à une vidéo 3 fois max | `GET /videos/:id` | `200 OK` jusqu’à 3 lectures |
| ✅ 4e lecture | – | `403 Forbidden`, "limite atteinte" |
| ❌ Accès après 1 mois | – | `403 Forbidden`, "abonnement expiré" |

---

### 6. Email de confirmation

| Scénario | Donnée d'entrée | Résultat attendu |
|---------|------------------|------------------|
| ✅ Envoi d’un email | `{ to, subject, html }` | `200 OK`, email envoyé (mocké dans les tests) |
| ❌ Email invalide | `{ to: 'invalid' }` | `500 Internal Server Error`, erreur levée |

---

## 🛡️ Tests de sécurité

| Cas testé | Résultat attendu |
|----------|------------------|
| Injection dans un champ utilisateur | Aucune exécution de code non désirée |
| JWT falsifié | `401 Unauthorized` |
| Accès admin sans token | `401 Unauthorized` |
| Accès à une route avec mauvais rôle | `403 Forbidden` |

---

## 🧪 Structure des réponses (standards)

- Toutes les réponses sont au format **JSON**
- Codes de statuts HTTP conformes :
    - `200` OK
    - `201` Created
    - `400` Bad Request
    - `401` Unauthorized
    - `403` Forbidden
    - `500` Internal Server Error
- Les erreurs contiennent toujours une clé `message`

---

## 🔁 Exécution des tests

- Lancement local :
  ```bash
  npm test
