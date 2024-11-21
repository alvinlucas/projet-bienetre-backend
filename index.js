const express = require("express");
const bodyParser = require("body-parser");
const db = require("./services/firebase");

const userRoutes = require("./routes/users");

const abonnementRoutes = require("./routes/abonnements");

const videoRoutes = require("./routes/videos");


const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Serveur opérationnel avec Firebase !");
});

// Utiliser les routes d'utilisateurs
app.use("/api/users", userRoutes);

// Utiliser les routes d'abonnements
app.use("/api/abonnements", abonnementRoutes);

// Utiliser les routes de vidéos
app.use("/api/videos", videoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
