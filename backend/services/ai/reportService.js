const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY || "");
const MODEL = "gemini-2.0-flash-exp";

const generatePDFReport = async (
  priorityAnalysis,
  parkRecommendations,
  activeLayers
) => {
  try {
    const prompt = `You are an expert in sustainable urban planning. Generate a professional and well-written report based on the following satellite analysis data.

CRITICAL INSTRUCTION: You MUST write the ENTIRE report in ENGLISH language. Every paragraph, sentence, and word must be in English. Do NOT use Spanish or any other language.

ANALYSIS DATA:
- Average temperature: ${priorityAnalysis.avgTemperature?.toFixed(1)}°C
- Average NDVI: ${((priorityAnalysis.avgNdvi || 0) * 100).toFixed(1)}%
- Total population: ${Math.round(
      priorityAnalysis.totalPopulation || 0
    ).toLocaleString("en-US")} inhabitants
- IPIV (Priority Index): ${priorityAnalysis.ipiv?.toFixed(1)}/10
- Intervention level: ${priorityAnalysis.interventionLevel || "N/A"}
- Thermal status: ${priorityAnalysis.analysis?.heatStatus || "N/A"}
- Vegetation status: ${priorityAnalysis.analysis?.vegetationStatus || "N/A"}

GENERATED RECOMMENDATIONS: ${
      parkRecommendations?.parkRecommendations?.length || 0
    } proposed green spaces

Generate a structured report with the following sections (in English, professional, concise):

1. EXECUTIVE SUMMARY (2-3 paragraphs)
   - Summary of current situation
   - Main findings
   - Urgency of intervention

2. ENVIRONMENTAL DIAGNOSIS (3-4 paragraphs)
   - Temperature analysis and its impact
   - Vegetation coverage assessment
   - Relationship with population density
   - Risk identification

3. PRIORITY ANALYSIS (2 paragraphs)
   - IPIV interpretation
   - Justification of required intervention level

4. INTERVENTION STRATEGY (2-3 paragraphs)
   - Recommended general approach
   - Priority intervention types
   - Expected benefits

5. CONCLUSIONS (2 paragraphs)
   - Summary of needs
   - Call to action

Use technical but accessible language. Be specific with the data. Maintain a professional and objective tone.

FINAL REMINDER: Write EVERYTHING in ENGLISH. No Spanish words or phrases allowed.`;

    const result = await ai
      .getGenerativeModel({ model: MODEL })
      .generateContent(prompt);

    const text = result.response.text();

    // Parse sections
    const sections = {
      resumenEjecutivo: extractSection(
        text,
        "EXECUTIVE SUMMARY",
        "ENVIRONMENTAL DIAGNOSIS"
      ),
      diagnosticoAmbiental: extractSection(
        text,
        "ENVIRONMENTAL DIAGNOSIS",
        "PRIORITY ANALYSIS"
      ),
      analisisPrioridad: extractSection(
        text,
        "PRIORITY ANALYSIS",
        "INTERVENTION STRATEGY"
      ),
      estrategiaIntervencion: extractSection(
        text,
        "INTERVENTION STRATEGY",
        "CONCLUSIONS"
      ),
      conclusiones: extractSection(text, "CONCLUSIONS", null),
    };

    return sections;
  } catch (error) {
    console.error("Error generating PDF report:", error);
    return null;
  }
};

const extractSection = (text, startMarker, endMarker) => {
  const startIndex = text.indexOf(startMarker);
  if (startIndex === -1) return "";

  const contentStart = text.indexOf("\n", startIndex) + 1;
  const endIndex = endMarker
    ? text.indexOf(endMarker, contentStart)
    : text.length;

  if (endIndex === -1) return text.substring(contentStart).trim();

  return text.substring(contentStart, endIndex).trim();
};

module.exports = { generatePDFReport };
