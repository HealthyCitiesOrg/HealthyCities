require('dotenv').config();
const express = require("express");
const cors = require("cors");
const config = require("./config");

// Configurar directorio temporal para Vercel
if (process.env.VERCEL) {
  process.env.TMPDIR = '/tmp';
  process.chdir('/tmp');
}

const earthEngineService = require("./services/earthEngineService");
const geeRoutes = require("./routes/geeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  origin: ['https://healthy-cities.trodi.dev', 'http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api", geeRoutes);

app.use(errorHandler);

// En Vercel, no inicializar al cargar (serverless)
if (!process.env.VERCEL) {
  earthEngineService
    .initEarthEngine()
    .then(() => {
      app.listen(config.port, () => {
        console.log(`🌍 Server running on http://localhost:${config.port}`);
      });
    })
    .catch((err) => {
      console.error("🔥 GEE initialization failed:", err);
      process.exit(1);
    });
}

module.exports = app;
