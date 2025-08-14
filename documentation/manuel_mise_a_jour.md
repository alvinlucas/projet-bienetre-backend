
# 🛠️ Manuel de mise à jour du backend

Ce document décrit les étapes à suivre pour effectuer les mises à jour du backend du projet **Bien-Être**.

## 🔁 1. Mettre à jour les dépendances

Avant toute mise à jour, assure-toi d’avoir Node.js installé.

### Étapes

1. Ouvre un terminal à la racine du projet.
2. Mets à jour les dépendances avec la commande suivante :

```bash
npm update
```

3. Si tu souhaites mettre à jour manuellement une dépendance spécifique :

```bash
npm install <nom_du_package>@latest
```

4. Vérifie les vulnérabilités éventuelles :

```bash
npm audit fix
```

---

## ⚙️ 2. Appliquer une mise à jour du code source

1. Mets à jour ton dépôt local :

```bash
git pull origin main
```

2. Si des fichiers `.env` sont mis à jour, pense à adapter ta configuration locale ou sur Render.

3. Redémarre le projet localement :

```bash
npm start
```

4. Teste l’application en local avant toute mise en production :

```bash
npm test
```

---

## 🚀 3. Redéployer sur Render

### Cas 1 : Déploiement manuel

1. Pousse les modifications sur GitHub (branche `main`) :

```bash
git add .
git commit -m "Mise à jour"
git push origin main
```

Render détectera automatiquement la mise à jour et déclenchera un déploiement.

### Cas 2 : Redéploiement manuel via Render

1. Va sur ton [tableau de bord Render](https://dashboard.render.com/).
2. Clique sur ton service backend.
3. Clique sur **Manual Deploy** > **Deploy latest commit**.

---

## 🧪 4. Vérification post-mise à jour

Après le redéploiement :

- Accède à l'URL de l'API Render (ex: `https://projet-bienetre-backend.onrender.com`).
- Vérifie les routes principales via Postman.
- Consulte les logs sur Render si des erreurs apparaissent.

---

## 🔐 5. Gestion des variables d’environnement

Si tu ajoutes ou modifies des variables dans `.env`, pense à les ajouter également dans la configuration Render (section **Environment** > **Add Environment Variable**).

---

## 🧹 6. Nettoyage éventuel

Supprimer les anciens fichiers ou modules inutiles :

```bash
npm prune
```

---

## 📚 Ressources

- Documentation Node.js : https://nodejs.org
- Documentation Render : https://render.com/docs
- Documentation npm : https://docs.npmjs.com
