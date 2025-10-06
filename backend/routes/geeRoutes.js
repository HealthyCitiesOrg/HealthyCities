const express = require("express");
const earthEngineService = require("../services/earthEngineService");
const ensureEE = require("../middleware/ensureEE");
const {
  validateCoordinates,
  validateYear,
  validateYearRange,
  validateMonth,
} = require("../validators/paramValidator");

const router = express.Router();

// Aplicar middleware a todas las rutas
router.use(ensureEE);

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/ndvi",
  asyncHandler(async (req, res) => {
    const { lat, lng, year } = req.query;
    const { latitude, longitude } = validateCoordinates(lat, lng);
    const validYear = validateYear(year);

    const tileUrl = await earthEngineService.getNdviTileUrl(
      latitude,
      longitude,
      validYear
    );
    res.json({ tileUrl });
  })
);

router.post(
  "/ndvi-polygon",
  asyncHandler(async (req, res) => {
    const { coordinates, year } = req.body;
    const validYear = validateYear(year);

    const tileUrl = await earthEngineService.getNdviTileUrlPolygon(
      coordinates,
      validYear
    );
    res.json({ tileUrl });
  })
);

router.get(
  "/lst",
  asyncHandler(async (req, res) => {
    const { lat, lng, year } = req.query;
    const { latitude, longitude } = validateCoordinates(lat, lng);
    const validYear = validateYear(year);

    const tileUrl = await earthEngineService.getLstTileUrl(
      latitude,
      longitude,
      validYear
    );
    res.json({ tileUrl });
  })
);

router.post(
  "/lst-polygon",
  asyncHandler(async (req, res) => {
    const { coordinates, year } = req.body;
    const validYear = validateYear(year);

    const tileUrl = await earthEngineService.getLstTileUrlPolygon(
      coordinates,
      validYear
    );
    res.json({ tileUrl });
  })
);

router.get(
  "/nighttime-lights",
  asyncHandler(async (req, res) => {
    const { lat, lng, year, month } = req.query;
    validateCoordinates(lat, lng);
    const validYear = validateYear(year);
    const validMonth = validateMonth(month);

    const tileUrl = await earthEngineService.getNighttimeLightsTileUrl(
      validYear,
      validMonth
    );
    res.json({ tileUrl });
  })
);

router.post(
  "/nighttime-lights-polygon",
  asyncHandler(async (req, res) => {
    const { coordinates, year, month } = req.body;
    const validYear = validateYear(year);
    const validMonth = validateMonth(month);

    const tileUrl = await earthEngineService.getNighttimeLightsTileUrlPolygon(
      coordinates,
      validYear,
      validMonth
    );
    res.json({ tileUrl });
  })
);

router.get(
  "/population-density",
  asyncHandler(async (req, res) => {
    const { lat, lng } = req.query;
    validateCoordinates(lat, lng);

    const tileUrl = await earthEngineService.getPopulationDensityTileUrl();
    res.json({ tileUrl });
  })
);

router.post(
  "/population-density-polygon",
  asyncHandler(async (req, res) => {
    const { coordinates } = req.body;

    const tileUrl = await earthEngineService.getPopulationDensityTileUrlPolygon(
      coordinates
    );
    res.json({ tileUrl });
  })
);

router.get(
  "/priority-zones",
  asyncHandler(async (req, res) => {
    const { lat, lng, year } = req.query;
    const { latitude, longitude } = validateCoordinates(lat, lng);
    const validYear = validateYear(year);

    const tileUrl = await earthEngineService.getPriorityZonesTileUrl(
      latitude,
      longitude,
      validYear
    );
    res.json({ tileUrl });
  })
);

router.post(
  "/priority-zones-polygon",
  asyncHandler(async (req, res) => {
    const { coordinates, year } = req.body;
    const validYear = validateYear(year);

    const tileUrl = await earthEngineService.getPriorityZonesTileUrlPolygon(
      coordinates,
      validYear
    );
    res.json({ tileUrl });
  })
);

router.get(
  "/priority-analysis",
  asyncHandler(async (req, res) => {
    const { lat, lng, year, radius } = req.query;
    const { latitude, longitude } = validateCoordinates(lat, lng);
    const validYear = validateYear(year);

    const analysis = await earthEngineService.getPriorityZonesAnalysis(
      latitude,
      longitude,
      validYear,
      radius ? parseInt(radius) : 5000
    );
    res.json(analysis);
  })
);

router.post(
  "/priority-analysis-polygon",
  asyncHandler(async (req, res) => {
    const { coordinates, activeLayers } = req.body;
    const { year } = req.query;

    if (!coordinates) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const validYear = validateYear(year);

    const analysis = await earthEngineService.getPriorityZonesAnalysisPolygon(
      coordinates,
      validYear,
      activeLayers
    );
    res.json(analysis);
  })
);

router.post(
  "/ai-park-recommendations",
  asyncHandler(async (req, res) => {
    const { coordinates, analysisData, activeLayers, mapImages } = req.body;

    if (!coordinates || !analysisData) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const parkRecommendations =
      await earthEngineService.generateParkRecommendations(
        analysisData,
        coordinates,
        activeLayers,
        mapImages
      );
    res.json(parkRecommendations);
  })
);

router.post(
  "/ai-pdf-report",
  asyncHandler(async (req, res) => {
    const { priorityAnalysis, parkRecommendations, activeLayers } = req.body;

    if (!priorityAnalysis) {
      return res.status(400).json({ error: "Missing priority analysis" });
    }

    const { generatePDFReport } = require("../services/ai/reportService");
    const report = await generatePDFReport(priorityAnalysis, parkRecommendations, activeLayers);
    res.json(report);
  })
);

module.exports = router;
