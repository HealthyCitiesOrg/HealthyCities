# Arquitectura del Backend - Clean Code

## Estructura de Directorios

```
backend/
├── config/                 # Configuración de la aplicación
│   └── index.js
├── credentials/            # Credenciales de servicios externos
│   └── service-account.json
├── helpers/                # Funciones auxiliares reutilizables
│   └── eeHelper.js        # Helpers para Earth Engine
├── middleware/             # Middlewares de Express
│   └── errorHandler.js    # Manejo centralizado de errores
├── routes/                 # Definición de rutas de la API
│   └── geeRoutes.js
├── services/               # Lógica de negocio separada por dominio
│   ├── earthEngineService.js  # Servicio principal (orquestador)
│   ├── ndvi/
│   │   └── ndviService.js     # Servicio de NDVI
│   ├── lst/
│   │   └── lstService.js      # Servicio de temperatura superficial
│   ├── urban/
│   │   └── urbanService.js    # Servicio de expansión urbana
│   ├── population/
│   │   └── populationService.js  # Servicio de densidad poblacional
│   ├── priority/
│   │   └── priorityService.js    # Servicio de zonas prioritarias
│   └── nighttime/
│       └── nighttimeService.js   # Servicio de luces nocturnas
├── utils/                  # Utilidades y constantes
│   ├── constants.js       # Constantes de la aplicación
│   └── errors.js          # Clases de error personalizadas
├── validators/             # Validadores de entrada
│   └── paramValidator.js  # Validación de parámetros
└── app.js                 # Punto de entrada de la aplicación
```

## Principios Aplicados

### 1. Separación de Responsabilidades (SRP)
- Cada servicio maneja un dominio específico (NDVI, LST, Urban, etc.)
- Los validadores están separados de la lógica de negocio
- Los helpers contienen funciones reutilizables

### 2. DRY (Don't Repeat Yourself)
- Constantes centralizadas en `utils/constants.js`
- Helpers reutilizables en `helpers/eeHelper.js`
- Validadores compartidos en `validators/paramValidator.js`

### 3. Manejo de Errores Consistente
- Clases de error personalizadas (`ValidationError`, `EarthEngineError`)
- Middleware centralizado de manejo de errores
- Propagación adecuada de errores

### 4. Código Limpio
- Nombres descriptivos de funciones y variables
- Funciones pequeñas con una sola responsabilidad
- Parámetros de visualización extraídos a constantes

## Flujo de Datos

1. **Request** → `routes/geeRoutes.js`
2. **Validación** → `validators/paramValidator.js`
3. **Servicio** → `services/{domain}/{domain}Service.js`
4. **Helpers** → `helpers/eeHelper.js`
5. **Response** o **Error** → `middleware/errorHandler.js`

## Ventajas de esta Arquitectura

- ✅ Fácil de mantener y extender
- ✅ Código testeable (cada módulo puede probarse independientemente)
- ✅ Reutilización de código
- ✅ Manejo consistente de errores
- ✅ Separación clara de responsabilidades
- ✅ Escalable para nuevas funcionalidades
