const ee = require("@google/earthengine");
const { EarthEngineError } = require("../utils/errors");

const createPoint = (lng, lat) => {
  return ee.Geometry.Point([parseFloat(lng), parseFloat(lat)]);
};

const createPolygon = (coordinates) => {
  return ee.Geometry.Polygon([coordinates]);
};

const getDateRange = (year) => {
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  };
};

const getMapId = (image, name) => {
  return new Promise((resolve, reject) => {
    ee.data.getMapId({ image, name }, (mapInfo, err) => {
      if (err) {
        return reject(
          new EarthEngineError(`Failed to generate ${name} tile URL`, err)
        );
      }
      resolve(mapInfo.urlFormat);
    });
  });
};

const reduceRegion = async (image, reducer, geometry, scale = 100) => {
  try {
    return await image
      .reduceRegion({
        reducer,
        geometry,
        scale,
        maxPixels: 1e9,
      })
      .getInfo();
  } catch (err) {
    throw new EarthEngineError("Failed to reduce region", err);
  }
};

const getDetailedStats = async (image, geometry, bandName, scale = 100) => {
  try {
    const reducer = ee.Reducer.mean()
      .combine({ reducer2: ee.Reducer.min(), sharedInputs: true })
      .combine({ reducer2: ee.Reducer.max(), sharedInputs: true })
      .combine({ reducer2: ee.Reducer.stdDev(), sharedInputs: true })
      .combine({
        reducer2: ee.Reducer.percentile([10, 25, 50, 75, 90]),
        sharedInputs: true,
      });

    const stats = await image
      .reduceRegion({
        reducer,
        geometry,
        scale,
        maxPixels: 1e9,
      })
      .getInfo();

    return {
      mean: stats[`${bandName}_mean`] || 0,
      min: stats[`${bandName}_min`] || 0,
      max: stats[`${bandName}_max`] || 0,
      stdDev: stats[`${bandName}_stdDev`] || 0,
      p10: stats[`${bandName}_p10`] || 0,
      p25: stats[`${bandName}_p25`] || 0,
      median: stats[`${bandName}_p50`] || 0,
      p75: stats[`${bandName}_p75`] || 0,
      p90: stats[`${bandName}_p90`] || 0,
    };
  } catch (err) {
    throw new EarthEngineError("Failed to get detailed stats", err);
  }
};

const sampleRegion = async (image, geometry, numPoints = 30, scale = 100) => {
  try {
    const samples = await image
      .sample({
        region: geometry,
        scale,
        numPixels: numPoints,
        geometries: true,
      })
      .getInfo();

    return samples.features.map((f) => ({
      coordinates: f.geometry.coordinates,
      properties: f.properties,
    }));
  } catch (err) {
    console.error("Warning: Failed to sample region", err);
    return [];
  }
};

module.exports = {
  createPoint,
  createPolygon,
  getDateRange,
  getMapId,
  reduceRegion,
  getDetailedStats,
  sampleRegion,
};
