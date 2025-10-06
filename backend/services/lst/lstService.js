const ee = require("@google/earthengine");
const { VISUALIZATION_PARAMS } = require("../../utils/constants");
const {
  createPoint,
  getDateRange,
  getMapId,
} = require("../../helpers/eeHelper");
const { EarthEngineError } = require("../../utils/errors");

const getLstTileUrl = async (lat, lng, year) => {
  const point = createPoint(lng, lat);
  const { startDate, endDate } = getDateRange(year);

  const modisCollection = ee
    .ImageCollection("MODIS/006/MOD11A2")
    .filterDate(startDate, endDate)
    .filterBounds(point)
    .select("LST_Day_1km");

  const modisSize = await modisCollection.size().getInfo();

  if (modisSize > 0) {
    const lstImage = modisCollection.mean().multiply(0.02).subtract(273.15).resample("bilinear").reproject({ crs: "EPSG:3857", scale: 1000 });
    const visImage = lstImage.visualize(VISUALIZATION_PARAMS.LST);
    return getMapId(visImage, "LST_MODIS");
  }

  const landsatCollection = ee
    .ImageCollection("LANDSAT/LC08/C02/T1_L2")
    .filterDate(startDate, endDate)
    .filterBounds(point)
    .filter(ee.Filter.lt("CLOUD_COVER", 10));

  const landsatSize = await landsatCollection.size().getInfo();

  if (landsatSize === 0) {
    throw new EarthEngineError(
      `No MODIS or Landsat data found for year ${year} at location (${lat}, ${lng})`
    );
  }

  const toaCollection = landsatCollection.map((image) => {
    const thermalDN = image.select("ST_B10");
    const lstKelvin = thermalDN.multiply(0.00341802).add(149.0);
    const lstCelsius = lstKelvin.subtract(273.15).rename("LST");
    return lstCelsius.copyProperties(image, image.propertyNames());
  });

  const lstImage = toaCollection.mean().resample("bilinear").reproject({ crs: "EPSG:3857", scale: 100 });
  const visImage = lstImage.visualize(VISUALIZATION_PARAMS.LST);

  return getMapId(visImage, "LST_Landsat");
};

const getLstTileUrlPolygon = async (coordinates, year) => {
  const { createPolygon } = require("../../helpers/eeHelper");
  const polygon = createPolygon(coordinates);
  const { startDate, endDate } = getDateRange(year);

  const modisCollection = ee
    .ImageCollection("MODIS/006/MOD11A2")
    .filterDate(startDate, endDate)
    .filterBounds(polygon)
    .select("LST_Day_1km");

  const modisSize = await modisCollection.size().getInfo();

  if (modisSize > 0) {
    const lstImage = modisCollection.mean().multiply(0.02).subtract(273.15).clip(polygon);
    const visImage = lstImage.visualize(VISUALIZATION_PARAMS.LST);
    return getMapId(visImage, "LST_MODIS");
  }

  const landsatCollection = ee
    .ImageCollection("LANDSAT/LC08/C02/T1_L2")
    .filterDate(startDate, endDate)
    .filterBounds(polygon)
    .filter(ee.Filter.lt("CLOUD_COVER", 10));

  const landsatSize = await landsatCollection.size().getInfo();

  if (landsatSize === 0) {
    throw new EarthEngineError(
      `No MODIS or Landsat data found for year ${year} in the selected area`
    );
  }

  const toaCollection = landsatCollection.map((image) => {
    const thermalDN = image.select("ST_B10");
    const lstKelvin = thermalDN.multiply(0.00341802).add(149.0);
    const lstCelsius = lstKelvin.subtract(273.15).rename("LST");
    return lstCelsius.copyProperties(image, image.propertyNames());
  });

  const lstImage = toaCollection.mean().clip(polygon);
  const visImage = lstImage.visualize(VISUALIZATION_PARAMS.LST);

  return getMapId(visImage, "LST_Landsat");
};

module.exports = {
  getLstTileUrl,
  getLstTileUrlPolygon,
};
