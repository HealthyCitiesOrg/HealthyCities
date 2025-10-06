# Healthy Cities AI 🚀

[![NASA Space Apps 2025 Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-2025%20Challenge-blue)](https://www.spaceappschallenge.org/2025/challenges/data-pathways-to-healthy-cities-and-human-settlements/)

**[Español](#español) | English**

**Healthy Cities AI is an AI-powered decision support system, driven by NASA data, designed to help urban planners build more resilient, sustainable, and equitable cities.**

> This project is a solution for the [2025 NASA Space Apps Challenge: Data Pathways to Healthy Cities and Human Settlements](https://www.spaceappschallenge.org/2025/challenges/data-pathways-to-healthy-cities-and-human-settlements/).

---

### ▶️ [Watch Demo Video](https://example.com/video-link) | 🌐 [Try Live Tool](https://healthy-cities.trodi.dev)

---

## 1. The Challenge: The Urban Dilemma

More than half of the world's population lives in cities, and this number continues to grow. Rapid urbanization, combined with the effects of climate change, places unprecedented pressure on urban infrastructure, ecosystems, and citizens' quality of life.

Urban planners face complex questions:
- Which communities suffer most from **heat islands** and need more **green spaces**?
- Where do **high population density** intersect with **poor air quality** or **lack of vegetation**?
- How to make strategic decisions that balance economic growth with environmental sustainability and human well-being?

NASA's Earth observation data is vast, but often complex to interpret and translate into concrete actions.

## 2. Our Solution: From Data to Decision

**Healthy Cities AI** bridges the gap between satellite data and actionable urban planning. Our platform not only visualizes data but synthesizes it through an **AI engine** to generate strategic and specific recommendations.

We transform complex questions into clear answers, allowing a planner to move from **analysis** to **action** in minutes.

![Application Screenshot](https://i.imgur.com/YOUR_SCREENSHOT_URL.png) 
*(Replace with a URL to your dashboard screenshot)*

## 3. Key Features ✨

- **Multi-layer Geospatial Analysis:** Visualize and combine critical data from NASA and other sources, including:
    - **Land Surface Temperature (LST):** To identify urban heat islands.
    - **Vegetation Index (NDVI):** To assess vegetation health and distribution.
    - **Population Density:** To understand demographic distribution.
    - **Nighttime Lights:** As an indicator of economic activity and urban expansion.

- **🤖 AI Recommendation Engine:** The heart of our platform. When selecting an area of interest, our AI service (powered by Google Gemini) analyzes the data and generates:
    - **Priority locations** for interventions (e.g., new parks, green corridors).
    - **Specific recommendations** with type, estimated size, and data-based justification.
    - **Expected impact estimation** (e.g., "reduce local temperature", "improve access to green spaces for X people").

- **📊 Dynamic Statistics Panel:** Quantifies the state of the selected area with key metrics (average temperature, mean NDVI, total population, etc.).

- **✍️ Interactive Area Selection (AOI):** Allows planners to draw custom polygons to analyze specific neighborhoods or entire regions.

- **📄 AI Report Generator:** Exports the complete analysis to a professional PDF. AI generates narrative content including executive summary, environmental diagnosis, priority analysis, intervention strategy, and conclusions, all with technical and professional language ready to present to authorities.

- **🗣️ Citizen Contribution Layer:** Allows residents to mark problematic areas on the map (e.g., "flood zone", "lack of shade"), providing valuable qualitative context to quantitative data.

## 4. The Planner's Journey

1.  **Select and Draw:** A planner chooses a city and draws the area of a new development project.
2.  **Visualize and Analyze:** The platform instantly loads relevant data layers, and the statistics panel reveals low vegetation coverage and high temperatures.
3.  **Consult AI:** With a click on "Analyze with AI", the system sends satellite data and area images to our AI engine.
4.  **Receive Strategies:** AI returns an action plan, suggesting 3 locations for new "pocket parks" and a "green corridor", with exact coordinates and justifications.
5.  **Generate Report:** The planner exports this analysis to a PDF and presents it at the next city council meeting, using NASA data to support their proposal.

## 5. NASA Data in Action 🛰️

This project is based on the following datasets and resources, fundamental to our analysis:

- **MODIS (Moderate Resolution Imaging Spectroradiometer):** For Land Surface Temperature (LST) and NDVI data.
- **Landsat Program:** Provides high-resolution optical imagery for detailed visual analysis.
- **NASA SEDAC (Socioeconomic Data and Applications Center):** Main source for our global population density data.
- **Black Marble (VIIRS Day/Night Band):** To analyze urban expansion and economic activity through nighttime lights.
- **Google Earth Engine:** Used in our backend to efficiently process and analyze these vast datasets.

## 6. Technology Stack 💻

- **Frontend:** React, Leaflet, Tailwind CSS.
- **Backend:** Node.js, Express.
- **Geospatial Processing:** Google Earth Engine API.
- **Artificial Intelligence:** Google AI SDK (Gemini).

## 7. Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- Google Earth Engine service account
- Google Gemini API key

### Environment Files
You'll need to create a `.env` file in the `backend` folder with your API key:
```
# backend/.env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Installation and Execution

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-user/healthy-cities.git
    cd healthy-cities
    ```

2.  **Start the Backend:**
    ```bash
    cd backend
    npm install
    npm start
    ```
    The server will run on `http://localhost:3001`.

3.  **Start the Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```
    The application will be available at `http://localhost:3000`.

## 8. Future Roadmap 🗺️

- **"What-If" Simulation Model:** Allow planners to simulate the impact of an intervention before implementing it (e.g., "How would temperature change if we add a 5-hectare park here?").
- **Integration of More Data Layers:** Add air quality data (Aerosol Index), flood risk, and transportation data.
- **Automated Alerts:** Set up a system that proactively notifies planners about significant environmental changes in their areas of interest.

## 9. License

This project is under the MIT License. See the `LICENSE` file for more details.

---

# Español

**Healthy Cities AI es un sistema de soporte a la decisión, impulsado por IA y datos de la NASA, diseñado para ayudar a los planificadores urbanos a construir ciudades más resilientes, sostenibles y equitativas.**

> Este proyecto es una solución para el desafío [2025 NASA Space Apps Challenge: Data Pathways to Healthy Cities and Human Settlements](https://www.spaceappschallenge.org/2025/challenges/data-pathways-to-healthy-cities-and-human-settlements/).

---

### ▶️ [Ver Video de Demostración](https://example.com/video-link) | 🌐 [Probar la Herramienta en Vivo](https://healthy-cities.trodi.dev)

---

## 1. El Desafío: El Dilema Urbano

Más de la mitad de la población mundial vive en ciudades, y esta cifra no para de crecer. La rápida urbanización, combinada con los efectos del cambio climático, ejerce una presión sin precedentes sobre la infraestructura urbana, los ecosistemas y la calidad de vida de los ciudadanos.

Los planificadores urbanos se enfrentan a preguntas complejas:
- ¿Qué comunidades sufren más por las **islas de calor** y necesitan más **espacios verdes**?
- ¿Dónde se cruzan la **alta densidad de población** con la **baja calidad del aire** o la **falta de vegetación**?
- ¿Cómo tomar decisiones estratégicas que equilibren el crecimiento económico con la sostenibilidad ambiental y el bienestar humano?

Los datos de observación de la Tierra de la NASA son vastos, pero a menudo son complejos de interpretar y traducir en acciones concretas.

## 2. Nuestra Solución: De los Datos a la Decisión

**Healthy Cities AI** cierra la brecha entre los datos satelitales y la planificación urbana accionable. Nuestra plataforma no solo visualiza datos, sino que los sintetiza a través de un **motor de IA** para generar recomendaciones estratégicas y específicas.

Transformamos preguntas complejas en respuestas claras, permitiendo a un planificador pasar del **análisis** a la **acción** en minutos.

## 3. Características Principales ✨

- **Análisis Geoespacial Multicapa:** Visualiza y combina datos críticos de la NASA y otras fuentes, incluyendo:
    - **Temperatura Superficial (LST):** Para identificar islas de calor urbanas.
    - **Índice de Vegetación (NDVI):** Para evaluar la salud y distribución de la vegetación.
    - **Densidad de Población:** Para entender la distribución demográfica.
    - **Luces Nocturnas:** Como indicador de actividad económica y expansión urbana.

- **🤖 Motor de Recomendaciones por IA:** El corazón de nuestra plataforma. Al seleccionar un área de interés, nuestro servicio de IA (impulsado por Gemini de Google) analiza los datos y genera:
    - **Ubicaciones prioritarias** para intervenciones (ej. nuevos parques, corredores verdes).
    - **Recomendaciones específicas** con tipo, tamaño estimado y justificación basada en datos.
    - **Estimación del impacto esperado** (ej. "reducir la temperatura local", "mejorar el acceso a espacios verdes para X personas").

- **📊 Panel de Estadísticas Dinámico:** Cuantifica el estado del área seleccionada con métricas clave (temperatura promedio, NDVI medio, población total, etc.).

- **✍️ Selección Interactiva de Área (AOI):** Permite a los planificadores dibujar polígonos personalizados para analizar barrios específicos o regiones enteras.

- **📄 Generador de Informes con IA:** Exporta el análisis completo a un PDF profesional. La IA genera contenido narrativo incluyendo resumen ejecutivo, diagnóstico ambiental, análisis de prioridad, estrategia de intervención y conclusiones, todo con lenguaje técnico y profesional listo para presentar a autoridades.

## 4. El Recorrido del Planificador

1.  **Selecciona y Dibuja:** Un planificador elige una ciudad y dibuja el área de un nuevo proyecto de desarrollo.
2.  **Visualiza y Analiza:** La plataforma carga instantáneamente las capas de datos relevantes, y el panel de estadísticas revela una baja cobertura vegetal y altas temperaturas.
3.  **Consulta a la IA:** Con un clic en "Analizar con IA", el sistema envía los datos satelitales y las imágenes del área a nuestro motor de IA.
4.  **Recibe Estrategias:** La IA devuelve un plan de acción, sugiriendo 3 ubicaciones para nuevos "parques de bolsillo" y un "corredor verde", con coordenadas exactas y justificaciones.
5.  **Genera el Informe:** El planificador exporta este análisis a un PDF y lo presenta en la siguiente reunión del ayuntamiento, usando los datos de la NASA para respaldar su propuesta.

## 5. Datos de la NASA en Acción 🛰️

Este proyecto se basa en los siguientes conjuntos de datos y recursos, fundamentales para nuestro análisis:

- **MODIS (Moderate Resolution Imaging Spectroradiometer):** Para datos de Temperatura Superficial Terrestre (LST) y NDVI.
- **Landsat Program:** Provee imágenes ópticas de alta resolución para un análisis visual detallado.
- **NASA SEDAC (Socioeconomic Data and Applications Center):** Fuente principal para nuestros datos de densidad de población global.
- **Black Marble (VIIRS Day/Night Band):** Para analizar la expansión urbana y la actividad económica a través de las luces nocturnas.
- **Google Earth Engine:** Utilizado en nuestro backend para procesar y analizar estos vastos conjuntos de datos de manera eficiente.

## 6. Pila Tecnológica 💻

- **Frontend:** React, Leaflet, Tailwind CSS.
- **Backend:** Node.js, Express.
- **Procesamiento Geoespacial:** Google Earth Engine API.
- **Inteligencia Artificial:** Google AI SDK (Gemini).

## 7. Cómo Empezar

### Prerrequisitos
- Node.js (v18 o superior)
- npm
- Cuenta de servicio de Google Earth Engine
- API key de Google Gemini

### Archivos de Entorno
Necesitarás crear un archivo `.env` en la carpeta `backend` con tu clave de API:
```
# backend/.env
GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
GOOGLE_PROJECT_ID=tu-proyecto-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=tu-email@proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Instalación y Ejecución

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/healthy-cities.git
    cd healthy-cities
    ```

2.  **Inicia el Backend:**
    ```bash
    cd backend
    npm install
    npm start
    ```
    El servidor se ejecutará en `http://localhost:3001`.

3.  **Inicia el Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm start
    ```
    La aplicación estará disponible en `http://localhost:3000`.

## 8. Hoja de Ruta Futura 🗺️

- **Modelo de Simulación "What-If":** Permitir a los planificadores simular el impacto de una intervención antes de realizarla (ej. "¿Cómo cambiaría la temperatura si añadimos un parque de 5 hectáreas aquí?").
- **Integración de Más Capas de Datos:** Añadir datos de calidad del aire (Aerosol Index), riesgo de inundaciones y datos de transporte.
- **Alertas Automatizadas:** Configurar un sistema que notifique proactivamente a los planificadores sobre cambios ambientales significativos en sus áreas de interés.

## 9. Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
