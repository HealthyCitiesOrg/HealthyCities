// Vercel serverless function handler
require('dotenv').config();

// Configurar directorio temporal
process.env.TMPDIR = '/tmp';

const app = require('../app');

module.exports = app;
