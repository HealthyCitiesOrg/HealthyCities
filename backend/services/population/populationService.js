const ee = require("@google/earthengine");
const { VISUALIZATION_PARAMS } = require("../../utils/constants");
const { getMapId } = require("../../helpers/eeHelper");

const getPopulationDensityTileUrl = async () => {
  const population = ee
    .Image("JRC/GHSL/P2023A/GHS_POP/2020")
    .select("population_count");

  const visImage = population.visualize(VISUALIZATION_PARAMS.POPULATION);

  return getMapId(visImage, "PopulationDensity");
};

const getPopulationDensityTileUrlPolygon = async (coordinates) => {
  const { createPolygon } = require("../../helpers/eeHelper");
  const polygon = createPolygon(coordinates);
  const population = ee
    .Image("JRC/GHSL/P2023A/GHS_POP/2020")
    .select("population_count")
    .clip(polygon);

  const visImage = population.visualize(VISUALIZATION_PARAMS.POPULATION);

  return getMapId(visImage, "PopulationDensity");
};

module.exports = {
  getPopulationDensityTileUrl,
  getPopulationDensityTileUrlPolygon,
};
