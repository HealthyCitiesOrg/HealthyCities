const ee = require("@google/earthengine");
const config = require("../config");

let eeInitialized = false;
let eeInitializing = false;
let eeInitPromise = null;

const initEarthEngine = () => {
  if (eeInitialized) {
    return Promise.resolve();
  }
  
  if (eeInitializing) {
    return eeInitPromise;
  }
  
  eeInitializing = true;
  eeInitPromise = new Promise((resolve, reject) => {
    let privateKey;
    
    if (process.env.NODE_ENV === 'production' && process.env.GOOGLE_PRIVATE_KEY) {
      privateKey = {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      };
    } else {
      privateKey = require(config.serviceAccountKeyPath);
    }

    ee.data.authenticateViaPrivateKey(
      privateKey,
      () => {
        ee.initialize(
          null,
          null,
          () => {
            console.log("✅ Earth Engine initialized successfully");
            eeInitialized = true;
            eeInitializing = false;
            resolve();
          },
          (err) => {
            console.error("❌ Earth Engine initialization failed:", err);
            eeInitializing = false;
            reject(err);
          }
        );
      },
      (err) => {
        console.error("❌ Earth Engine authentication failed:", err);
        eeInitializing = false;
        reject(err);
      }
    );
  });
  
  return eeInitPromise;
};

const { getNdviTileUrl, getNdviTileUrlPolygon } = require("./ndvi/ndviService");
const { getLstTileUrl, getLstTileUrlPolygon } = require("./lst/lstService");
const {
  getUrbanExpansionTileUrl,
  getUrbanExpansionTileUrlPolygon,
} = require("./urban/urbanService");
const {
  getPopulationDensityTileUrl,
  getPopulationDensityTileUrlPolygon,
} = require("./population/populationService");
const {
  getNighttimeLightsTileUrl,
  getNighttimeLightsTileUrlPolygon,
} = require("./nighttime/nighttimeService");
const {
  getPriorityZonesTileUrl,
  getPriorityZonesAnalysis,
  getPriorityZonesAnalysisPolygon,
  getPriorityZonesTileUrlPolygon,
} = require("./priority/priorityService");
const { generateParkRecommendations } = require("./ai/aiService");

module.exports = {
  initEarthEngine,
  ensureInitialized: initEarthEngine,
  getNdviTileUrl,
  getNdviTileUrlPolygon,
  getLstTileUrl,
  getLstTileUrlPolygon,
  getUrbanExpansionTileUrl,
  getUrbanExpansionTileUrlPolygon,
  getPopulationDensityTileUrl,
  getPopulationDensityTileUrlPolygon,
  getNighttimeLightsTileUrl,
  getNighttimeLightsTileUrlPolygon,
  getPriorityZonesTileUrl,
  getPriorityZonesTileUrlPolygon,
  getPriorityZonesAnalysis,
  getPriorityZonesAnalysisPolygon,
  generateParkRecommendations,
};
