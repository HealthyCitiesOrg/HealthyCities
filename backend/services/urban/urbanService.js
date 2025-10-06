const ee = require("@google/earthengine");
const { VISUALIZATION_PARAMS } = require("../../utils/constants");
const { createPoint, getMapId } = require("../../helpers/eeHelper");

const getUrbanExpansionTileUrl = async (lat, lng, yearStart, yearEnd) => {
  const point = createPoint(lng, lat);
  const dataset = ee.Image("JRC/GHSL/P2016/BUILT_LDSMT_GLOBE_V1");

  const builtStart = dataset.select(`built_${yearStart}`);
  const builtEnd = dataset.select(`built_${yearEnd}`);

  const expansion = builtEnd.gt(0).and(builtStart.eq(0)).selfMask();
  const visImage = expansion.visualize(VISUALIZATION_PARAMS.URBAN_EXPANSION);

  return getMapId(visImage, "UrbanExpansion");
};

const getUrbanExpansionTileUrlPolygon = async (coordinates, yearStart, yearEnd) => {
  const { createPolygon } = require("../../helpers/eeHelper");
  const polygon = createPolygon(coordinates);
  const dataset = ee.Image("JRC/GHSL/P2016/BUILT_LDSMT_GLOBE_V1");

  const builtStart = dataset.select(`built_${yearStart}`);
  const builtEnd = dataset.select(`built_${yearEnd}`);

  const expansion = builtEnd.gt(0).and(builtStart.eq(0)).selfMask().clip(polygon);
  const visImage = expansion.visualize(VISUALIZATION_PARAMS.URBAN_EXPANSION);

  return getMapId(visImage, "UrbanExpansion");
};

module.exports = {
  getUrbanExpansionTileUrl,
  getUrbanExpansionTileUrlPolygon,
};
