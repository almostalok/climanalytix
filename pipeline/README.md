# Climate Analytics — Production Data Pipeline Architecture

## Target Architecture

```
Raw .nc (AgERA5 / IMD)
   ↓
Python / xarray (Validation & Dimension checks)
   ↓
Per-cell JSON files (0.25° grid lattice: {lat}_{lon}.json)
   ↓
Daily Grid Rasters (daily/{date}.json)
   ↓
Climatological Normals (30-year WMO baseline 1991-2020)
   ↓
Region-to-Grid GIS Spatial Lookup (GeoPandas / Shapely)
   ↓
Cloudflare R2 (Private bucket storage)
   ↓
Cloudflare Worker (JWT verification, rate limiting, CORS)
   ↓
React Frontend (Consumes lightweight preprocessed files)
```

## Security & Edge Strategy
- The browser **never** downloads the 600+ MB NetCDF files directly.
- R2 bucket remains private. Cloudflare Worker enforces JWT validation before streaming per-grid JSON slices.
- Zero client-side computation bottlenecks.

## Scripts
1. `inspect_netcdf.py`: Inspects dimensions, coordinates, calendar, variables, units.
2. `process_era5.py`: Chunks dataset into 0.25° grid JSON and calculates normals.
3. `validate_engine.py`: Proves mathematical parity between Python NetCDF processing and the TypeScript `climate-engine`.
