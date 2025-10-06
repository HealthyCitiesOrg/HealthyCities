const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
const MODEL = "gemini-2.0-flash-thinking-exp";

const PARK_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    parkRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: [
              "Urban Park",
              "Green Corridor",
              "Tree-lined Plaza",
              "Community Garden",
            ],
          },
          location: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER },
              description: { type: Type.STRING },
            },
            required: ["lat", "lng", "description"],
          },
          size: { type: Type.STRING },
          priority: {
            type: Type.STRING,
            enum: ["CRITICAL", "HIGH", "MEDIUM"],
          },
          reason: { type: Type.STRING },
          features: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          estimatedImpact: { type: Type.STRING },
        },
        required: [
          "type",
          "location",
          "size",
          "priority",
          "reason",
          "features",
          "estimatedImpact",
        ],
      },
    },
    generalStrategy: { type: Type.STRING },
  },
  required: ["parkRecommendations", "generalStrategy"],
};

const calculateBounds = (coordinates) => {
  const lats = coordinates.map((c) => c[1]);
  const lngs = coordinates.map((c) => c[0]);
  return {
    north: Math.max(...lats),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    west: Math.min(...lngs),
  };
};

const calculateCenter = (coordinates) => {
  const lats = coordinates.map((c) => c[1]);
  const lngs = coordinates.map((c) => c[0]);
  return {
    lat: (Math.max(...lats) + Math.min(...lats)) / 2,
    lng: (Math.max(...lngs) + Math.min(...lngs)) / 2,
  };
};

const generateParkRecommendations = async (
  analysisData,
  coordinates,
  activeLayers = {},
  mapImages = []
) => {
  try {
    const bounds = calculateBounds(coordinates);
    const center = calculateCenter(coordinates);

    const activeLayersList = Object.entries(activeLayers)
      .filter(([_, isActive]) => isActive)
      .map(([layer]) => layer)
      .join(", ");

    const polygonVertices = coordinates
      .map((c) => `[${c[1].toFixed(6)}, ${c[0].toFixed(6)}]`)
      .join(", ");

    // Calcular área del polígono en km²
    const calculateArea = (coords) => {
      let area = 0;
      for (let i = 0; i < coords.length; i++) {
        const j = (i + 1) % coords.length;
        area += coords[i][0] * coords[j][1];
        area -= coords[j][0] * coords[i][1];
      }
      return Math.abs(area / 2) * 12100; // Aproximación en km²
    };

    const areaKm2 = calculateArea(coordinates);
    const isRegion = areaKm2 > 100; // Más de 100 km² se considera región
    const recommendationCount = isRegion ? "5-10" : "3-5";
    const scaleType = isRegion ? "REGIÓN" : "CIUDAD";

    let prompt = `You are an expert in urban and environmental planning. Analyze this ${scaleType} with REAL satellite data and recommend ${recommendationCount} SPECIFIC locations for green spaces.

IMPORTANT: You MUST respond EXCLUSIVELY in ENGLISH. All descriptions, reasons, features, and text fields MUST be written in English only.

ANALYSIS AREA:
- TYPE: ${scaleType} (${areaKm2.toFixed(2)} km²)
- Center: [${center.lat.toFixed(6)}, ${center.lng.toFixed(6)}]
- Bounds: N ${bounds.north.toFixed(6)}, S ${bounds.south.toFixed(
      6
    )}, E ${bounds.east.toFixed(6)}, W ${bounds.west.toFixed(6)}
- Polygon: ${coordinates.length} vertices
- SCALE: ${
      isRegion
        ? "REGIONAL - Analyze macro patterns and distribute recommendations across the entire region"
        : "URBAN - Focus on specific city zones"
    }

GENERAL ENVIRONMENTAL DATA:
- Average temperature: ${
      analysisData.avgTemperature?.toFixed(2) || "N/A"
    }°C (Status: ${analysisData.analysis?.heatStatus || "N/A"})
- Average NDVI: ${analysisData.avgNdvi?.toFixed(3) || "N/A"} (Status: ${
      analysisData.analysis?.vegetationStatus || "N/A"
    })
- Total population: ${Math.round(
      analysisData.totalPopulation || 0
    ).toLocaleString()} inhabitants
- IPIV: ${analysisData.ipiv?.toFixed(2) || "N/A"}/10
- Requires intervention: ${
      analysisData.analysis?.needsIntervention ? "YES" : "NO"
    }

ACTIVE LAYERS: ${activeLayersList || "none"}`;

    if (analysisData.layerData) {
      prompt += "\n\nDETAILED ACTIVE LAYER DATA:";

      if (analysisData.layerData.ndvi) {
        const { stats, samples } = analysisData.layerData.ndvi;
        const criticalSamples = samples.filter((s) => s.properties.NDVI < 0.3);
        prompt += `\n\nVEGETATION (NDVI):
- Range: ${stats.min.toFixed(3)} to ${stats.max.toFixed(3)}
- Median: ${stats.median.toFixed(3)}
- 10th Percentile (critical zones): ${stats.p10.toFixed(3)}
- 90th Percentile (green zones): ${stats.p90.toFixed(3)}
- Critical points detected (NDVI < 0.3): ${criticalSamples.length}/${
          samples.length
        }`;

        if (criticalSamples.length > 0) {
          const topCritical = criticalSamples.slice(0, 3);
          prompt += `\n- Most critical locations: ${topCritical
            .map(
              (s) =>
                `[${s.coordinates[1].toFixed(6)}, ${s.coordinates[0].toFixed(
                  6
                )}] NDVI=${s.properties.NDVI.toFixed(3)}`
            )
            .join(", ")}`;
        }
      }

      if (analysisData.layerData.lst) {
        const { stats, samples } = analysisData.layerData.lst;
        const hotSamples = samples.filter((s) => s.properties.LST_Day_1km > 35);
        prompt += `\n\nSURFACE TEMPERATURE (LST):
- Range: ${stats.min.toFixed(1)}°C to ${stats.max.toFixed(1)}°C
- Median: ${stats.median.toFixed(1)}°C
- 90th Percentile (hottest zones): ${stats.p90.toFixed(1)}°C
- Critical heat points (>35°C): ${hotSamples.length}/${samples.length}`;

        if (hotSamples.length > 0) {
          const topHot = hotSamples.slice(0, 3);
          prompt += `\n- Hottest locations: ${topHot
            .map(
              (s) =>
                `[${s.coordinates[1].toFixed(6)}, ${s.coordinates[0].toFixed(
                  6
                )}] ${s.properties.LST_Day_1km.toFixed(1)}°C`
            )
            .join(", ")}`;
        }
      }

      if (analysisData.layerData.population) {
        const { stats, samples } = analysisData.layerData.population;
        const denseSamples = samples.filter(
          (s) => s.properties.population_count > stats.p75
        );
        prompt += `\n\nPOPULATION DENSITY:
- Range: ${Math.round(stats.min)} to ${Math.round(stats.max)} inhab/pixel
- Median: ${Math.round(stats.median)} inhab/pixel
- 75th Percentile: ${Math.round(stats.p75)} inhab/pixel
- High density zones detected: ${denseSamples.length}/${samples.length}`;
      }
    }

    const contentParts = [prompt];

    if (mapImages && mapImages.length > 0) {
      prompt += `\n\nPROVIDED MAP IMAGES (${mapImages.length} layers):`;

      mapImages.forEach((imageObj, idx) => {
        const metadata = imageObj.metadata || {};
        const imageData = imageObj.data || imageObj;

        if (metadata.layerName) {
          prompt += `\n\nIMAGE ${idx + 1}: ${metadata.layerName}`;
          prompt += `\n- ${metadata.description || "See image to interpret"}`;
        }

        if (
          imageData &&
          typeof imageData === "string" &&
          imageData.startsWith("data:image")
        ) {
          const base64Data = imageData.split(",")[1];
          contentParts.push({
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Data,
            },
          });
        }
      });

      contentParts[0] = prompt;
    }

    prompt += `\n\nCRITICAL INSTRUCTIONS FOR ${scaleType}:

1. VISUAL IMAGE ANALYSIS:
   - Examine EACH provided image using the color legends
   - NDVI: Identify beige/light areas (low vegetation <0.3)
   - LST: Locate red/yellow areas (high temperature >35°C)
   - Population: Detect red zones (high density >150 inhab/ha)
   - Priority Zones: Mark critical areas (score >6)

2. SCALE-BASED STRATEGY:
   ${
     isRegion
       ? `- REGION: Distribute recommendations across DIFFERENT geographic zones
   - Cover north, south, east, west and center of the region
   - Prioritize main cities and populated areas within the region
   - Consider green corridors connecting multiple localities`
       : `- CITY: Focus on specific neighborhoods and urban zones
   - Identify critical points in different districts
   - Prioritize densely populated areas with green deficit
   - Consider neighborhood parks and local plazas`
   }

3. LOCATION IDENTIFICATION:
   - CROSS visual information (images) with numerical data
   - Look for coincidences: Low vegetation + High temperature + High density
   - USE exact coordinates from identified critical points
   - ALL coordinates MUST be INSIDE the polygon

4. QUANTITY AND DISTRIBUTION:
   - Generate ${recommendationCount} recommendations
   - DISTRIBUTE geographically across the entire area
   - Prioritize zones with greatest need (high temperature + low vegetation + high population)

5. SPECIFIC CHARACTERISTICS BY TYPE:
   - Parque Urbano: 1-5 hectares, complete equipment, shade trees
   - Corredor Verde: Connects spaces, bike lanes, linear vegetation
   - Plaza Arbolada: 0.5-1 hectare, native trees, urban furniture
   - Jardín Comunitario: 0.2-0.5 hectares, neighborhood participation, gardens

6. QUANTIFIABLE IMPACT:
   - Specify expected temperature reduction (°C)
   - Directly benefited population (inhabitants)
   - Added green area (m² or hectares)
   - Projected NDVI improvement

DO NOT concentrate all in a single zone
   - Vary green space types according to local context

5. SPECIFICITY:
   - Describe EXACTLY where each location is based on the images
   - Mention observed visual patterns (e.g., "red zone in LST to the northeast")
   - Justify with numerical data AND visual observations
   - Estimate appropriate size according to scale (${
     isRegion ? "hectares for region" : "square meters for city"
   })

Generate ${recommendationCount} GEOGRAPHICALLY DISTRIBUTED recommendations with:
- Precise coordinates within the polygon
- Detailed description of location observed in images (IN ENGLISH)
- Appropriate green space type for the scale
- Realistic estimated size
- Priority based on visual and numerical analysis
- Specific reason with evidence from images and data (IN ENGLISH)
- Characteristics adapted to local context (IN ENGLISH)
- Quantifiable expected impact (IN ENGLISH)

REMINDER: ALL text fields (description, reason, features, estimatedImpact, generalStrategy) MUST be written in ENGLISH language.`;

    contentParts[0] = prompt;

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: contentParts,
      config: {
        responseMimeType: "application/json",
        responseSchema: PARK_SCHEMA,
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating park recommendations:", error);
    console.error("Error details:", error.message);
    return {
      parkRecommendations: [],
      generalStrategy: "Error generating recommendations. Please try again.",
    };
  }
};

module.exports = {
  generateParkRecommendations,
};
