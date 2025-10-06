import { FileText, Download } from "lucide-react";
import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const LAYER_CONFIG = {
  ndvi: { name: "Índice de Vegetación (NDVI)", selector: ".leaflet-pane" },
  lst: { name: "Islas de Calor (LST)", selector: ".leaflet-pane" },
  urbanExpansion: {
    name: "Expansión Urbana (2015-2025)",
    selector: ".leaflet-pane",
  },
  nighttimeLights: {
    name: "Luces Nocturnas (VIIRS)",
    selector: ".leaflet-pane",
  },
  population: {
    name: "Densidad Poblacional (GHSL)",
    selector: ".leaflet-pane",
  },
  priorityZones: {
    name: "Zonas Prioritarias (Análisis)",
    selector: ".leaflet-pane",
  },
};

const captureMapSnapshot = async (element) => {
  if (!element) return null;

  const canvas = await html2canvas(element, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#1e293b",
    scale: 2,
  });
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.9),
    width: canvas.width,
    height: canvas.height,
  };
};

const addPageIfNeeded = (pdf, yPos, requiredSpace, pageHeight) => {
  if (yPos + requiredSpace > pageHeight - 20) {
    pdf.addPage();
    return 20;
  }
  return yPos;
};

const ReportButton = ({
  priorityAnalysis,
  activeLayers,
  year,
  parkRecommendations,
  isGridView,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const { t } = useTranslation();

  const handleGenerateReport = async () => {
    if (!priorityAnalysis) return;

    setIsGenerating(true);
    try {
      // Generar reporte con IA
      const aiResponse = await fetch(
        `${API_URL}/ai-pdf-report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priorityAnalysis,
            parkRecommendations,
            activeLayers,
          }),
        }
      );
      const aiReportData = await aiResponse.json();
      setAiReport(aiReportData);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPos = 20;

      // Portada
      pdf.setFontSize(24);
      pdf.setTextColor(31, 41, 55);
      pdf.text("REPORTE DE ANÁLISIS", pageWidth / 2, yPos, { align: "center" });
      yPos += 8;
      pdf.text("URBANO SOSTENIBLE", pageWidth / 2, yPos, { align: "center" });

      yPos += 15;
      pdf.setFontSize(10);
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `Fecha: ${new Date().toLocaleDateString("es-ES")}`,
        pageWidth / 2,
        yPos,
        { align: "center" }
      );
      pdf.text(`Año de análisis: ${year}`, pageWidth / 2, yPos + 5, {
        align: "center",
      });
      yPos += 10;
      pdf.text(
        "Generado con datos satelitales de la NASA",
        pageWidth / 2,
        yPos,
        { align: "center" }
      );

      // Resumen Ejecutivo (IA)
      if (aiReportData?.resumenEjecutivo) {
        pdf.addPage();
        yPos = 20;
        pdf.setFontSize(18);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Resumen Ejecutivo", 20, yPos);
        yPos += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const resumenLines = pdf.splitTextToSize(
          aiReportData.resumenEjecutivo,
          pageWidth - 40
        );
        pdf.text(resumenLines, 20, yPos);
        yPos += resumenLines.length * 5 + 15;
      }

      // IPIV
      yPos = addPageIfNeeded(pdf, yPos, 40, pageHeight);
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text("Índice de Prioridad de Intervención Verde (IPIV)", 20, yPos);

      yPos += 10;
      const ipiv = priorityAnalysis.ipiv || 0;
      pdf.setFontSize(24);
      pdf.setTextColor(
        ipiv > 7 ? 220 : ipiv > 5 ? 245 : 16,
        ipiv > 7 ? 38 : ipiv > 5 ? 158 : 185,
        ipiv > 7 ? 38 : ipiv > 5 ? 11 : 129
      );
      pdf.text(`${ipiv.toFixed(1)}/10`, 20, yPos);

      pdf.setFontSize(12);
      pdf.setTextColor(31, 41, 55);
      pdf.text(
        `Nivel: ${priorityAnalysis.interventionLevel || "N/A"}`,
        50,
        yPos
      );

      yPos += 10;

      // Indicadores
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text("Indicadores Ambientales", 20, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.text(
        `• Temperatura Promedio: ${
          priorityAnalysis.avgTemperature?.toFixed(1) || "N/A"
        }°C`,
        25,
        yPos
      );
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `  Estado: ${priorityAnalysis.analysis?.heatStatus || "N/A"}`,
        25,
        yPos + 5
      );
      yPos += 12;

      pdf.setTextColor(31, 41, 55);
      pdf.text(
        `• Índice de Vegetación: ${(
          (priorityAnalysis.avgNdvi || 0) * 100
        ).toFixed(1)}%`,
        25,
        yPos
      );
      pdf.setTextColor(107, 114, 128);
      pdf.text(
        `  Estado: ${priorityAnalysis.analysis?.vegetationStatus || "N/A"}`,
        25,
        yPos + 5
      );
      yPos += 12;

      pdf.setTextColor(31, 41, 55);
      pdf.text(
        `• Población Total: ${(
          priorityAnalysis.totalPopulation || 0
        ).toLocaleString("es-ES")} habitantes`,
        25,
        yPos
      );
      yPos += 15;

      // Diagnóstico Ambiental (IA)
      if (aiReportData?.diagnosticoAmbiental) {
        yPos = addPageIfNeeded(pdf, yPos, 60, pageHeight);
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Diagnóstico Ambiental", 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const diagLines = pdf.splitTextToSize(
          aiReportData.diagnosticoAmbiental,
          pageWidth - 40
        );
        pdf.text(diagLines, 20, yPos);
        yPos += diagLines.length * 5 + 10;
      }

      // Análisis de Prioridad (IA)
      if (aiReportData?.analisisPrioridad) {
        yPos = addPageIfNeeded(pdf, yPos, 40, pageHeight);
        pdf.setFontSize(14);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Análisis de Prioridad de Intervención", 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const priorLines = pdf.splitTextToSize(
          aiReportData.analisisPrioridad,
          pageWidth - 40
        );
        pdf.text(priorLines, 20, yPos);
        yPos += priorLines.length * 5 + 10;
      }

      // Resumen de capas
      yPos = addPageIfNeeded(pdf, yPos, 30, pageHeight);
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text("Capas Analizadas", 20, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      const activeLayersCount =
        Object.values(activeLayers).filter(Boolean).length;
      pdf.text(`Total de capas activas: ${activeLayersCount}`, 25, yPos);
      yPos += 15;

      // Replicar el orden de capas que usa GridMapView basado en layerOrder
      // Necesitamos obtener el layerOrder del contexto, por ahora usamos el orden de las claves
      const layerOrderKeys = [
        "ndvi",
        "lst",
        "urbanExpansion",
        "nighttimeLights",
        "population",
        "priorityZones",
      ];
      const activeLayersList = layerOrderKeys
        .filter((key) => activeLayers[key])
        .map((key) => [key, true]);

      if (activeLayersList.length > 0) {
        if (isGridView) {
          console.log("Modo Grid detectado");
          console.log(
            "Orden de capas activas:",
            activeLayersList.map(([key]) => key)
          );
          // Buscar todos los contenedores de mini-mapas en el grid
          const miniMapContainers =
            document.querySelectorAll(".leaflet-container");
          console.log("Mini-mapas encontrados:", miniMapContainers.length);
          console.log("Capas activas a procesar:", activeLayersList.length);

          // Esperar un momento para asegurar que el DOM esté completamente renderizado
          await new Promise((resolve) => setTimeout(resolve, 500));

          for (
            let i = 0;
            i < activeLayersList.length && i < miniMapContainers.length;
            i++
          ) {
            const [key] = activeLayersList[i];
            const layerInfo = LAYER_CONFIG[key];
            if (!layerInfo) {
              console.log("Capa no encontrada en config:", key);
              continue;
            }

            console.log(
              `Capturando capa ${i + 1}/${activeLayersList.length}: ${
                layerInfo.name
              }`
            );
            const mapSnapshot = await captureMapSnapshot(miniMapContainers[i]);
            if (!mapSnapshot) {
              console.log("Error capturando mapa", i);
              continue;
            }

            pdf.addPage();
            yPos = 20;

            pdf.setFontSize(14);
            pdf.setTextColor(31, 41, 55);
            pdf.text(layerInfo.name, pageWidth / 2, yPos, { align: "center" });
            yPos += 10;

            const maxWidth = pageWidth - 40;
            const maxHeight = pageHeight - 50;
            const aspectRatio = mapSnapshot.width / mapSnapshot.height;

            let imgWidth = maxWidth;
            let imgHeight = imgWidth / aspectRatio;

            if (imgHeight > maxHeight) {
              imgHeight = maxHeight;
              imgWidth = imgHeight * aspectRatio;
            }

            const xPos = (pageWidth - imgWidth) / 2;

            pdf.addImage(
              mapSnapshot.dataUrl,
              "JPEG",
              xPos,
              yPos,
              imgWidth,
              imgHeight
            );
          }
        } else {
          console.log("Modo mapa único detectado");
          // Modo único: capturar el primer (y único) mapa
          const singleMap = document.querySelector(".leaflet-container");
          const mapSnapshot = await captureMapSnapshot(singleMap);

          if (mapSnapshot) {
            pdf.addPage();
            yPos = 20;

            pdf.setFontSize(14);
            pdf.setTextColor(31, 41, 55);
            pdf.text("Mapa con Capas Activas", pageWidth / 2, yPos, {
              align: "center",
            });
            yPos += 10;

            const maxWidth = pageWidth - 40;
            const maxHeight = pageHeight - 50;
            const aspectRatio = mapSnapshot.width / mapSnapshot.height;

            let imgWidth = maxWidth;
            let imgHeight = imgWidth / aspectRatio;

            if (imgHeight > maxHeight) {
              imgHeight = maxHeight;
              imgWidth = imgHeight * aspectRatio;
            }

            const xPos = (pageWidth - imgWidth) / 2;

            pdf.addImage(
              mapSnapshot.dataUrl,
              "JPEG",
              xPos,
              yPos,
              imgWidth,
              imgHeight
            );
          }
        }
      }

      // Estrategia de Intervención (IA)
      if (aiReportData?.estrategiaIntervencion) {
        pdf.addPage();
        yPos = 20;
        pdf.setFontSize(16);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Estrategia de Intervención", 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const estratLines = pdf.splitTextToSize(
          aiReportData.estrategiaIntervencion,
          pageWidth - 40
        );
        pdf.text(estratLines, 20, yPos);
        yPos += estratLines.length * 5 + 15;
      }

      // Soluciones Recomendadas
      yPos = addPageIfNeeded(pdf, yPos, 40, pageHeight);
      pdf.setFontSize(16);
      pdf.setTextColor(31, 41, 55);
      pdf.text("Soluciones Recomendadas", 20, yPos);
      yPos += 10;

      const solutions = [];
      if (priorityAnalysis.avgTemperature > 35) {
        solutions.push({
          title: "Reducción de Temperatura",
          actions: [
            "Implementar techos verdes en edificios públicos",
            "Pintar superficies con materiales reflectantes",
            "Crear corredores de ventilación natural",
            "Instalar fuentes de agua en espacios públicos",
          ],
          impact: "Reducción estimada: 2-5°C",
        });
      }
      if (priorityAnalysis.avgNdvi < 0.3) {
        solutions.push({
          title: "Incremento de Vegetación",
          actions: [
            "Programa de arborización con especies nativas",
            "Jardines verticales en fachadas",
            "Conversión de estacionamientos en parques",
            "Incentivos fiscales para propiedades con jardines",
          ],
          impact: "Objetivo: NDVI >0.4 en 3 años",
        });
      }

      pdf.setFontSize(10);
      solutions.forEach((solution, idx) => {
        yPos = addPageIfNeeded(pdf, yPos, 40, pageHeight);

        pdf.setFontSize(12);
        pdf.setTextColor(31, 41, 55);
        pdf.text(`${idx + 1}. ${solution.title}`, 25, yPos);
        yPos += 7;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        solution.actions.forEach((action) => {
          const actionText = pdf.splitTextToSize(
            `   • ${action}`,
            pageWidth - 50
          );
          pdf.text(actionText, 25, yPos);
          yPos += actionText.length * 5 + 2;
        });

        pdf.setTextColor(16, 185, 129);
        pdf.text(`   ${solution.impact}`, 25, yPos);
        yPos += 10;
      });

      // Recomendaciones de parques con plan de acción
      if (parkRecommendations?.parkRecommendations?.length > 0) {
        pdf.addPage();
        yPos = 20;

        pdf.setFontSize(16);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Plan de Implementación de Espacios Verdes", 20, yPos);
        yPos += 10;

        pdf.setFontSize(10);
        parkRecommendations.parkRecommendations.forEach((park, idx) => {
          yPos = addPageIfNeeded(pdf, yPos, 60, pageHeight);

          pdf.setFontSize(12);
          pdf.setTextColor(31, 41, 55);
          pdf.text(`${idx + 1}. ${park.type}`, 25, yPos);
          yPos += 6;

          pdf.setFontSize(10);
          pdf.setTextColor(107, 114, 128);
          pdf.text(`Ubicación: ${park.location.description}`, 30, yPos);
          yPos += 5;
          pdf.text(
            `Prioridad: ${park.priority} | Tamaño: ${park.size}`,
            30,
            yPos
          );
          yPos += 7;

          // Presupuesto estimado
          const sizeMultiplier = park.size.includes("pequeño")
            ? 1
            : park.size.includes("mediano")
            ? 2
            : 3;
          const priorityMultiplier =
            park.priority === "CRÍTICA"
              ? 1.3
              : park.priority === "ALTA"
              ? 1.15
              : 1;
          const budget = 50000 * sizeMultiplier * priorityMultiplier;

          pdf.setTextColor(16, 185, 129);
          pdf.text(
            `Presupuesto estimado: $${budget.toLocaleString("es-ES")} USD`,
            30,
            yPos
          );
          yPos += 7;

          // Fases de implementación
          pdf.setTextColor(75, 85, 99);
          pdf.text("Fases de implementación:", 30, yPos);
          yPos += 5;

          const phases = [
            "0-3 meses: Estudios de factibilidad y consulta ciudadana",
            "3-6 meses: Diseño y aprobación de permisos",
            "6-12 meses: Construcción e instalación",
            "Continuo: Mantenimiento y monitoreo de impacto",
          ];

          phases.forEach((phase) => {
            pdf.text(`   • ${phase}`, 30, yPos);
            yPos += 4;
          });

          yPos += 8;
        });
      }

      // Conclusiones (IA)
      if (aiReportData?.conclusiones) {
        pdf.addPage();
        yPos = 20;
        pdf.setFontSize(16);
        pdf.setTextColor(31, 41, 55);
        pdf.text("Conclusiones y Recomendaciones", 20, yPos);
        yPos += 8;

        pdf.setFontSize(10);
        pdf.setTextColor(75, 85, 99);
        const concLines = pdf.splitTextToSize(
          aiReportData.conclusiones,
          pageWidth - 40
        );
        pdf.text(concLines, 20, yPos);
        yPos += concLines.length * 5 + 10;
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text(
        "Generado por HealthyCities - NASA Space Apps Challenge",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );

      pdf.save(`reporte-urbano-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleGenerateReport}
      disabled={!priorityAnalysis || isGenerating}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg"
    >
      {isGenerating ? (
        <>
          <Download className="w-5 h-5 animate-bounce" />
          <span>{t("report.generating")}</span>
        </>
      ) : (
        <>
          <FileText className="w-5 h-5" />
          <span>{t("report.generate")}</span>
        </>
      )}
    </button>
  );
};

export default ReportButton;
