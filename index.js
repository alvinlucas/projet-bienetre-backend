const express = require("express");
const bodyParser = require("body-parser");
const db = require("./services/firebase");

const userRoutes = require("./routes/users");

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Serveur opérationnel avec Firebase !");
});

// Utiliser les routes d'utilisateurs
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
