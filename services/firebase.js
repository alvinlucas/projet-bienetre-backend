const admin = require("firebase-admin");
if (process.env.FIREBASE_KEY_JSON) {
    serviceAccount = JSON.parse(
        process.env.FIREBASE_KEY_JSON.replace(/\\n/g, '\n')
    );
} else {
    serviceAccount = require("../serviceAccountKey.json");
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
module.exports = db;
