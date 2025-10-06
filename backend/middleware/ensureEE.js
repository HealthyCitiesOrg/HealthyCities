const earthEngineService = require('../services/earthEngineService');

const ensureEarthEngineInitialized = async (req, res, next) => {
  try {
    await earthEngineService.ensureInitialized();
    next();
  } catch (error) {
    console.error('Failed to initialize Earth Engine:', error);
    res.status(503).json({ 
      error: 'Earth Engine service unavailable',
      message: 'Unable to initialize Earth Engine. Please try again.'
    });
  }
};

module.exports = ensureEarthEngineInitialized;
