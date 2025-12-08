const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",   // deja vacío si usas XAMPP
  database: "resenas_lugares"
});

db.connect(err => {
  if (err) {
    console.error("Error conectando a MySQL:", err);
    return;
  }
  console.log("Conexión a MySQL exitosa");
});

// RUTA DE PRUEBA
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

// ARRANCAR SERVIDOR
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
