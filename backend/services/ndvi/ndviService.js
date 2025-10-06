const ee = require("@google/earthengine");
const { VISUALIZATION_PARAMS, THRESHOLDS } = require("../../utils/constants");
const {
  createPoint,
  getDateRange,
  getMapId,
} = require("../../helpers/eeHelper");

const getNdviTileUrl = async (lat, lng, year) => {
  const point = createPoint(lng, lat);
  const { startDate, endDate } = getDateRange(year);

  const collection = ee
    .ImageCollection("COPERNICUS/S2_SR")
    .filterDate(startDate, endDate)
    .filterBounds(point)
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", THRESHOLDS.CLOUD_COVER))
    .map((img) => img.normalizedDifference(["B8", "B4"]).rename("NDVI"));

  const ndvi = collection.mean();
  const visImage = ndvi.visualize(VISUALIZATION_PARAMS.NDVI);

  return getMapId(visImage, "NDVI");
};

const getNdviTileUrlPolygon = async (coordinates, year) => {
  const { createPolygon } = require("../../helpers/eeHelper");
  const polygon = createPolygon(coordinates);
  const { startDate, endDate } = getDateRange(year);

  const collection = ee
    .ImageCollection("COPERNICUS/S2_SR")
    .filterDate(startDate, endDate)
    .filterBounds(polygon)
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", THRESHOLDS.CLOUD_COVER))
    .map((img) => img.normalizedDifference(["B8", "B4"]).rename("NDVI"));

  const ndvi = collection.mean().clip(polygon);
  const visImage = ndvi.visualize(VISUALIZATION_PARAMS.NDVI);

  return getMapId(visImage, "NDVI");
};

module.exports = {
  getNdviTileUrl,
  getNdviTileUrlPolygon,
};
