// MB5370 - Module 04
// Workshop 3 - Nightlights in Global Coastlines

// 4.3.1 Image Data

// Population
var population =
  ee.ImageCollection("CIESIN/GPWv411/GPW_Population_Count");

print(population);

// Import two images for start and end
var population_2000 =
  ee.Image('CIESIN/GPWv411/GPW_Population_Count/gpw_v4_population_count_rev11_2000_30_sec');

var population_2015 =
  ee.Image('CIESIN/GPWv411/GPW_Population_Count/gpw_v4_population_count_rev11_2015_30_sec');

print(population_2000);

// Visualisation parameters
var population_vis = {
  'max': 1000.0,
  'palette': [
    'ffffe7',
    '86a192',
    '509791',
    '307296',
    '2c4484',
    '000066'
  ],
  'min': 0.0
};

Map.addLayer(population_2000, population_vis, 'population_count_2000');
Map.addLayer(population_2015, population_vis, 'population_count_2015');


// 4.3.1 — Nighttime Lights

// Import nighttime lights ImageCollection
var nl = ee.ImageCollection(
  'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS'
);

print(nl);

// Get two images for start and end
// Select the avg_vis band and rename it to nightlight
var nl_2000 = ee.Image(
  'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F142000'
).select(['avg_vis'], ['nightlight']);

var nl_2013 = ee.Image(
  'NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182013'
).select(['avg_vis'], ['nightlight']);

print('nightlight 2000 processed', nl_2000);
print('nightlight 2013 processed', nl_2013);

// Visualisation parameters
var nighttimeLightsVis = {
  min: 0,
  max: 63,
  palette: ['000000', '444444', '888888', 'ffff99', 'ffffff']
};

// Display both years
Map.addLayer(nl_2000, nighttimeLightsVis, 'Nighttime Lights 2000');
Map.addLayer(nl_2013, nighttimeLightsVis, 'Nighttime Lights 2013');


// 4.3.2 — VECTOR DATA

// Import the recommended 2-degree global grid
var worldgrid = ee.FeatureCollection(
  'users/murrnick/mb5370/worldgrid_2deg'
);

//print('Global grid:', worldgrid);
Map.addLayer(worldgrid, {color: 'green'}, 'Global Grid', false);


// Import the coastline dataset
var coast = ee.FeatureCollection(
  'projects/UQ_intertidal/dataMasks/naturalEarthCoastline_v1'
);

print('Coastline:', coast);
Map.addLayer(coast, {color: 'yellow'}, 'Coastline', false);


// Filter the global grid to coastal regions
var coastGrids = worldgrid.filter(
  ee.Filter.bounds(coast)
);

//print('Coastal grid cells:', coastGrids.size());

Map.addLayer(
  coastGrids,
  {color: 'firebrick'},
  'Coastal Grid Cells',
  false
);

// 4.4 — Preparing for Global Analysis

// Filter coastal grid cells to a small test region
// 4.6 — Global coastal grid
var coast_ecoregions = worldgrid
  .filter(ee.Filter.bounds(coast));

Map.addLayer(
  coast_ecoregions,
  {color: 'firebrick'},
  'Coastal Grid',
  false
);

//print('Test grid cells:', coast_ecoregions.size());


// 4.5 — GLOBAL CHANGE

// Population change between 2000 and 2015
var pop_change = population_2015
  .subtract(population_2000);

Map.addLayer(
  pop_change,
  {palette: ['red', 'black', 'lime'], min: -500, max: 500},
  'pop_change',
  false,
  0.9
);


// Nighttime light change between 2000 and 2013
var nl_change = nl_2013
  .subtract(nl_2000);

Map.addLayer(
  nl_change,
  {palette: ['red', 'black', 'lime'], min: -50, max: 50},
  'nl_change',
  false,
  0.9
);


// 4.5 — AVERAGE NIGHTLIGHT CHANGE PER GRID CELL

var nl_changePerEcoregion = nl_change.reduceRegions({
  collection: coast_ecoregions,
  reducer: ee.Reducer.mean(),
  scale: 1000
});

// Inspect only the first feature
//print('Mean nightlight change - first grid cell:',
//     nl_changePerEcoregion.first());
      
      
// Average population change per coastal grid cell
var pop_changePerEcoregion = pop_change.reduceRegions({
  collection: coast_ecoregions,
  reducer: ee.Reducer.mean(),
  scale: 1000
});

// Inspect the first feature
//print('Mean population change - first grid cell:',
//      pop_changePerEcoregion.first());


// 4.6 — EXPORT GLOBAL RESULTS

// Export population change
Export.table.toAsset({
  collection: pop_changePerEcoregion,
  description: 'export_pop_toAsset',
  assetId: 'projects/mb5370-global-analysis/assets/pop_changePerEcoregion'
});

// Export nighttime light change
Export.table.toAsset({
  collection: nl_changePerEcoregion,
  description: 'export_nl_toAsset',
  assetId: 'projects/mb5370-global-analysis/assets/nl_changePerEcoregion'
});