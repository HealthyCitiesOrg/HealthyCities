const ee = require("@google/earthengine");
const { VISUALIZATION_PARAMS } = require("../../utils/constants");
const { getMapId } = require("../../helpers/eeHelper");

const getNighttimeLightsTileUrl = async (year, month) => {
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${(parseInt(month) + 1)
    .toString()
    .padStart(2, "0")}-01`;

  const collection = ee
    .ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG")
    .filterDate(startDate, endDate)
    .select("avg_rad");

  const nightLights = collection.mean();
  const visImage = nightLights.visualize(VISUALIZATION_PARAMS.NIGHTTIME_LIGHTS);

  return getMapId(visImage, "NighttimeLights");
};

const getNighttimeLightsTileUrlPolygon = async (coordinates, year, month) => {
  const { createPolygon } = require("../../helpers/eeHelper");
  const polygon = createPolygon(coordinates);
  const startDate = `${year}-${month.toString().padStart(2, "0")}-01`;
  const endDate = `${year}-${(parseInt(month) + 1)
    .toString()
    .padStart(2, "0")}-01`;

  const collection = ee
    .ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG")
    .filterDate(startDate, endDate)
    .select("avg_rad");

  const nightLights = collection.mean().clip(polygon);
  const visImage = nightLights.visualize(VISUALIZATION_PARAMS.NIGHTTIME_LIGHTS);

  return getMapId(visImage, "NighttimeLights");
};

module.exports = {
  getNighttimeLightsTileUrl,
  getNighttimeLightsTileUrlPolygon,
};
