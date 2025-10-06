const VISUALIZATION_PARAMS = {
  NDVI: {
    min: -0.2,
    max: 0.8,
    palette: ["#FFFFFF", "#CBE4CB", "#228B22"],
  },
  LST: {
    min: 20,
    max: 45,
    palette: ["blue", "yellow", "red"],
  },
  URBAN_EXPANSION: {
    palette: ["#ff0000"],
    opacity: 1,
  },
  POPULATION: {
    min: 0,
    max: 200,
    palette: ["FFFFE0", "FFA500", "FF4500", "8B0000"],
  },
  PRIORITY_ZONES: {
    min: 0,
    max: 8,
    palette: ["FFFF00", "FF8C00", "FF0000", "8B0000"],
  },
  NIGHTTIME_LIGHTS: {
    min: 0,
    max: 5,
    palette: ["000000", "0000FF", "8B00FF", "FFFF00", "FFFFFF"],
  },
};

const THRESHOLDS = {
  CLOUD_COVER: 20,
  LOW_VEGETATION: 0.3,
  HIGH_TEMPERATURE: 35,
  HIGH_POPULATION: 100,
  GOOD_VEGETATION: 0.4,
  MODERATE_VEGETATION: 0.2,
  CRITICAL_TEMPERATURE: 40,
  IPIV_CRITICAL: 7,
  IPIV_HIGH: 5,
  IPIV_MEDIUM: 3,
};

const ALLOWED_YEARS = [1975, 1990, 2000, 2014, 2015];

module.exports = {
  VISUALIZATION_PARAMS,
  THRESHOLDS,
  ALLOWED_YEARS,
};
