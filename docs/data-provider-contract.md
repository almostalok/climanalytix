# Climate Analytics — Data Provider Contract

## High-Level Architecture

```
+-------------------+
|  Raw NetCDF Files | (AgERA5 / IMD 0.25° Gridded Datasets)
+---------+---------+
          |
          v
+-------------------+
|  Python Pipeline  | (xarray, geopandas, shapely preprocessor)
+---------+---------+
          |
          v
+-------------------+
|   Cloudflare R2   | (Private storage bucket for chunked JSON slices)
+---------+---------+
          |
          v
+-------------------+
| Cloudflare Worker | (JWT validation, CORS, rate limiting, edge caching)
+---------+---------+
          |
          v
+-------------------+
|   React Client    | (Consumes HttpClimateDataProvider in production,
+-------------------+  MockClimateDataProvider in demo mode)
```

## Environment Configuration

- `VITE_DEMO_MODE`: Set to `'true'` to force `MockClimateDataProvider` (seeded in-browser PRNG). Set to `'false'` for production.
- `VITE_API_BASE_URL`: Base URL for the Cloudflare Worker API.
  - Default: `https://climanalytix.alokisstudying.workers.dev`

## Authentication

All protected requests send a Bearer JWT token in the `Authorization` header:
```http
Authorization: Bearer <jwt_token>
```
The Cloudflare Worker validates the token signature, checks expiration (`exp`), and ensures the request is authorized before proxying the R2 object.

---

## API Endpoints Contract

### 1. Dataset Manifest
- **Route:** `GET /api/manifest`
- **Description:** Returns metadata for all operational datasets, spatial resolutions, temporal coverage, and availability status.
- **Response Format:**
```json
[
  {
    "id": "ERA5",
    "name": "ERA5 Reanalysis",
    "resolution": "0.25° (~27 km)",
    "startYear": 1979,
    "endYear": 2026,
    "latestDate": "2026-09-15",
    "status": "Available",
    "description": "ECMWF atmospheric reanalysis of the global climate."
  },
  {
    "id": "IMD",
    "name": "IMD High-Resolution Gridded",
    "resolution": "0.25° (~27 km)",
    "startYear": 1975,
    "endYear": 2026,
    "latestDate": "2026-09-15",
    "status": "Available",
    "description": "India Meteorological Department operational daily gridded rainfall and temperature station-interpolated dataset."
  }
]
```

### 2. Administrative Regions Hierarchy
- **Route:** `GET /api/regions`
- **Description:** Returns administrative boundaries hierarchy (State → District → Sub-district/Block) with spatial centroid coordinates.
- **Response Format:**
```json
[
  {
    "id": "up",
    "name": "Uttar Pradesh",
    "type": "state",
    "parentId": "ind",
    "centroid": [26.8467, 80.9462]
  },
  {
    "id": "up_gbnagar",
    "name": "Gautam Buddha Nagar",
    "type": "district",
    "parentId": "up",
    "centroid": [28.5355, 77.391]
  },
  {
    "id": "up_gb_dadri",
    "name": "Dadri",
    "type": "block",
    "parentId": "up_gbnagar"
  }
]
```

### 3. Grid Lattice Catalog
- **Route:** `GET /api/grids?dataset={ERA5|IMD}`
- **Description:** Returns the 0.25° grid lattice points mapped to administrative identifiers.
- **Response Format:**
```json
[
  {
    "id": "28.50_77.50",
    "lat": 28.5,
    "lon": 77.5,
    "dataset": "ERA5",
    "resolution": 0.25,
    "stateId": "up",
    "districtId": "up_gbnagar",
    "blockId": "up_gb_dadri",
    "name": "Dadri / Greater Noida (UP)"
  }
]
```

### 4. Time Series Extraction
- **Route:** `GET /api/series?dataset={ERA5|IMD}&gridId={gridId}&variable={rainfall|temperature}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}`
- **Description:** Extracts daily continuous time series for a single 0.25° grid cell across the requested date window.
- **Response Format:**
```json
[
  {
    "date": "2024-07-01",
    "value": 34.5,
    "variable": "rainfall",
    "unit": "mm",
    "lat": 28.5,
    "lon": 77.5,
    "refGrid": "28.50_77.50"
  }
]
```

### 5. Daily Grid Spatial Snapshot
- **Route:** `GET /api/daily?dataset={ERA5|IMD}&variable={rainfall|temperature}&date={YYYY-MM-DD}&normalPeriod={10|20|30}`
- **Description:** Returns all India grid cells for a single day with actual observation, 10/20/30-year climatological normal, and percentage anomaly.
- **Response Format:**
```json
{
  "date": "2024-07-15",
  "dataset": "ERA5",
  "variable": "rainfall",
  "unit": "mm",
  "cells": [
    {
      "id": "28.50_77.50",
      "lat": 28.5,
      "lon": 77.5,
      "value": 42.0,
      "normal": 18.5,
      "anomalyPct": 127.0,
      "anomalyFormatted": "+127.0%",
      "unit": "mm",
      "regionName": "Dadri / Greater Noida (UP)"
    }
  ]
}
```

---

## Cloudflare R2 Storage Hierarchy

Preprocessed NetCDF chunks stored in private R2 bucket:
- `/manifest.json` — Static catalog metadata
- `/regions.json` — GeoJSON administrative boundaries
- `/grids/{dataset}.json` — 0.25° grid lattice index
- `/series/{dataset}/{variable}/{gridId}.json` — Full historical daily time series per grid cell
- `/daily/{dataset}/{variable}/{YYYY-MM-DD}.json` — Spatial slice across all India grid cells
- `/normals/{dataset}/{variable}/{gridId}.json` — 365-day day-of-year baseline normals
