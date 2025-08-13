const admin = require("firebase-admin");
if (process.env.FIREBASE_KEY_JSON) {
    // En CI GitHub : on lit la clé JSON à partir de la variable d'environnement
    serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON);
} else {
    // En local : on lit le fichier
    serviceAccount = require("../serviceAccountKey.json");
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
