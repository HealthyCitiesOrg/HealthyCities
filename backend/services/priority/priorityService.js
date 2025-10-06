const ee = require("@google/earthengine");
const { VISUALIZATION_PARAMS, THRESHOLDS } = require("../../utils/constants");
const {
  createPoint,
  createPolygon,
  getDateRange,
  getMapId,
  reduceRegion,
  getDetailedStats,
  sampleRegion,
} = require("../../helpers/eeHelper");

const IPIV_WEIGHTS = {
  NDVI: 0.35,
  LST: 0.4,
  POPULATION: 0.25,
};

const IPIV_SCALE = 10;

const LST_NORMALIZATION = {
  MIN: 20,
  RANGE: 30,
};

const POPULATION_LOG_DIVISOR = 10;

const INTERVENTION_LEVELS = {
  CRITICAL: "crítica",
  HIGH: "alta",
  MEDIUM: "media",
  LOW: "baja",
};

const RECOMMENDATIONS = {
  CRITICAL: "Intervención urgente: crear parques y áreas verdes",
  HIGH: "Intervención prioritaria: aumentar cobertura vegetal",
  MEDIUM: "Monitoreo: considerar mejoras graduales",
  LOW: "Zona estable: mantener condiciones actuales",
};

const VEGETATION_STATUS = {
  GOOD: "good",
  MODERATE: "moderate",
  CRITICAL: "critical",
};

const HEAT_STATUS = {
  CRITICAL: "critical",
  HIGH: "high",
  MODERATE: "moderate",
};

const normalizeNDVI = (ndvi) => ndvi.multiply(-1).add(1).divide(2).clamp(0, 1);

const normalizeLST = (lst) =>
  lst
    .subtract(LST_NORMALIZATION.MIN)
    .divide(LST_NORMALIZATION.RANGE)
    .clamp(0, 1);

const normalizePopulation = (population) =>
  population.add(1).log().divide(POPULATION_LOG_DIVISOR).clamp(0, 1);

const calculatePriorityScore = (ndvi, lst, population) => {
  const ndviNorm = normalizeNDVI(ndvi);
  const lstNorm = normalizeLST(lst);
  const popNorm = normalizePopulation(population);

  return ndviNorm
    .multiply(IPIV_WEIGHTS.NDVI)
    .add(lstNorm.multiply(IPIV_WEIGHTS.LST))
    .add(popNorm.multiply(IPIV_WEIGHTS.POPULATION))
    .multiply(IPIV_SCALE);
};

const analyzeVegetationStatus = (avgNdvi) => {
  if (avgNdvi > THRESHOLDS.GOOD_VEGETATION) return VEGETATION_STATUS.GOOD;
  if (avgNdvi > THRESHOLDS.MODERATE_VEGETATION)
    return VEGETATION_STATUS.MODERATE;
  return VEGETATION_STATUS.CRITICAL;
};

const analyzeHeatStatus = (avgTemp) => {
  if (avgTemp > THRESHOLDS.CRITICAL_TEMPERATURE) return HEAT_STATUS.CRITICAL;
  if (avgTemp > THRESHOLDS.HIGH_TEMPERATURE) return HEAT_STATUS.HIGH;
  return HEAT_STATUS.MODERATE;
};

const getInterventionLevel = (ipiv) => {
  if (ipiv > THRESHOLDS.IPIV_CRITICAL) return INTERVENTION_LEVELS.CRITICAL;
  if (ipiv > THRESHOLDS.IPIV_HIGH) return INTERVENTION_LEVELS.HIGH;
  if (ipiv > THRESHOLDS.IPIV_MEDIUM) return INTERVENTION_LEVELS.MEDIUM;
  return INTERVENTION_LEVELS.LOW;
};

const getRecommendation = (ipiv) => {
  if (ipiv > THRESHOLDS.IPIV_CRITICAL) return RECOMMENDATIONS.CRITICAL;
  if (ipiv > THRESHOLDS.IPIV_HIGH) return RECOMMENDATIONS.HIGH;
  if (ipiv > THRESHOLDS.IPIV_MEDIUM) return RECOMMENDATIONS.MEDIUM;
  return RECOMMENDATIONS.LOW;
};

const fetchNDVIData = (startDate, endDate, region) => {
  return ee
    .ImageCollection("COPERNICUS/S2_SR")
    .filterDate(startDate, endDate)
    .filterBounds(region)
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", THRESHOLDS.CLOUD_COVER))
    .map((img) => img.normalizedDifference(["B8", "B4"]).rename("NDVI"))
    .mean();
};

const fetchLSTData = (startDate, endDate, region) => {
  return ee
    .ImageCollection("MODIS/006/MOD11A2")
    .filterDate(startDate, endDate)
    .filterBounds(region)
    .select("LST_Day_1km")
    .mean()
    .multiply(0.02)
    .subtract(273.15);
};

const fetchPopulationData = () => {
  return ee.Image("JRC/GHSL/P2023A/GHS_POP/2020").select("population_count");
};

const computeIPIVStats = async (
  priorityScore,
  ndvi,
  lst,
  population,
  region
) => {
  const [stats, ndviStats, lstStats, popStats] = await Promise.all([
    reduceRegion(
      priorityScore,
      ee.Reducer.mean().combine({
        reducer2: ee.Reducer.max(),
        sharedInputs: true,
      }),
      region
    ),
    reduceRegion(ndvi, ee.Reducer.mean(), region),
    reduceRegion(lst, ee.Reducer.mean(), region),
    reduceRegion(population, ee.Reducer.sum(), region),
  ]);

  return {
    ipiv: stats.mean || 0,
    maxIpiv: stats.max || 0,
    avgNdvi: ndviStats.NDVI || 0,
    avgTemp: lstStats.LST_Day_1km || 0,
    totalPopulation: popStats.population_count || 0,
  };
};

const buildAnalysisResult = (statsData) => {
  const { ipiv, maxIpiv, avgNdvi, avgTemp, totalPopulation } = statsData;

  return {
    ipiv: parseFloat(ipiv.toFixed(2)),
    maxIpiv: parseFloat(maxIpiv.toFixed(2)),
    interventionLevel: getInterventionLevel(ipiv),
    avgNdvi: parseFloat(avgNdvi.toFixed(3)),
    avgTemperature: parseFloat(avgTemp.toFixed(1)),
    totalPopulation: Math.round(totalPopulation),
    analysis: {
      vegetationStatus: analyzeVegetationStatus(avgNdvi),
      heatStatus: analyzeHeatStatus(avgTemp),
      needsIntervention: ipiv > THRESHOLDS.IPIV_HIGH,
      recommendation: getRecommendation(ipiv),
    },
  };
};

const generatePriorityVisualization = (
  ndvi,
  lst,
  population,
  region = null
) => {
  const priorityScore = calculatePriorityScore(ndvi, lst, population);
  const maskedScore = region
    ? priorityScore.selfMask().clip(region)
    : priorityScore.selfMask();
  return maskedScore.visualize(VISUALIZATION_PARAMS.PRIORITY_ZONES);
};

const getPriorityZonesTileUrl = async (lat, lng, year) => {
  const point = createPoint(lng, lat);
  const { startDate, endDate } = getDateRange(year);

  const ndvi = fetchNDVIData(startDate, endDate, point);
  const lst = fetchLSTData(startDate, endDate, point);
  const population = fetchPopulationData();
  const visImage = generatePriorityVisualization(ndvi, lst, population);

  return getMapId(visImage, "PriorityZones");
};

const getPriorityZonesAnalysis = async (lat, lng, year, radius = 5000) => {
  const point = createPoint(lng, lat);
  const aoi = point.buffer(radius);
  const { startDate, endDate } = getDateRange(year);

  const ndvi = fetchNDVIData(startDate, endDate, aoi);
  const lst = fetchLSTData(startDate, endDate, aoi);
  const population = fetchPopulationData();
  const priorityScore = calculatePriorityScore(ndvi, lst, population);

  const statsData = await computeIPIVStats(
    priorityScore,
    ndvi,
    lst,
    population,
    aoi
  );

  return buildAnalysisResult(statsData);
};

const getPriorityZonesAnalysisPolygon = async (
  coordinates,
  year,
  activeLayers = {}
) => {
  const polygon = createPolygon(coordinates);
  const { startDate, endDate } = getDateRange(year);

  const ndvi = fetchNDVIData(startDate, endDate, polygon);
  const lst = fetchLSTData(startDate, endDate, polygon);
  const population = fetchPopulationData();
  const priorityScore = calculatePriorityScore(ndvi, lst, population);

  const statsData = await computeIPIVStats(
    priorityScore,
    ndvi,
    lst,
    population,
    polygon
  );

  const layerData = {};
  if (activeLayers.ndvi) {
    layerData.ndvi = {
      stats: await getDetailedStats(ndvi, polygon, "NDVI"),
      samples: await sampleRegion(ndvi, polygon, 30),
    };
  }
  if (activeLayers.lst) {
    layerData.lst = {
      stats: await getDetailedStats(lst, polygon, "LST_Day_1km"),
      samples: await sampleRegion(lst, polygon, 30),
    };
  }
  if (activeLayers.population) {
    layerData.population = {
      stats: await getDetailedStats(population, polygon, "population_count"),
      samples: await sampleRegion(population, polygon, 30),
    };
  }

  return {
    ...buildAnalysisResult(statsData),
    layerData,
  };
};

const getPriorityZonesTileUrlPolygon = async (coordinates, year) => {
  const polygon = createPolygon(coordinates);
  const { startDate, endDate } = getDateRange(year);

  const ndvi = fetchNDVIData(startDate, endDate, polygon);
  const lst = fetchLSTData(startDate, endDate, polygon);
  const population = fetchPopulationData();
  const visImage = generatePriorityVisualization(
    ndvi,
    lst,
    population,
    polygon
  );

  return getMapId(visImage, "PriorityZones");
};

module.exports = {
  getPriorityZonesTileUrl,
  getPriorityZonesAnalysis,
  getPriorityZonesAnalysisPolygon,
  getPriorityZonesTileUrlPolygon,
};
