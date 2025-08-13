const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require("./services/firebase");
const userRoutes = require("./routes/users");
const abonnementRoutes = require("./routes/abonnements");
const videoRoutes = require("./routes/videos");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Serveur opérationnel avec Firebase !");
});

app.use("/api/users", userRoutes);
app.use("/api/subscriptions", abonnementRoutes);
app.use("/api/videos", videoRoutes);

module.exports = app;
