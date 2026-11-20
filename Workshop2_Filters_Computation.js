// MB5370 - Module 04: Global Scale Analysis
// Workshop 1 - Visualising Data in Earth Engine
// Section 2.10 - Configuring the Map
Map.setOptions('SATELLITE');
// Centre map on Mount Taranaki, New Zealand
Map.setCenter(174.0638, -39.298, 11);
// Display SRTM elevation data
// Custom elevation colour palette
var elevationVis = {
  min: 0,
  max: 2500,
  palette: ['darkgreen', 'yellow', 'orange', 'red', 'white']
};

Map.addLayer(image, elevationVis, 'SRTM Elevation', true, 0.6);
// Display protected areas
Map.addLayer(table, {color: 'darkgreen'}, 'Protected Areas');
// Workshop 2 - Filters and Computation
// Count protected areas in the dataset
print('No of protected areas:', table.size());
// Inspect the first protected area
print('First protected area:', table.first());
// Filter for IUCN Category II National Parks
var nationalParks = table.filter(
  ee.Filter.eq('IUCN_CAT', 'II')
);

print('Number of national parks:', nationalParks.size());
// Display only IUCN Category II National Parks
Map.addLayer(nationalParks, {color: 'blue'}, 'National Parks');
// Protected areas designated by 1980
var iucn_pre1980 = table.filter(
  ee.Filter.lte('STATUS_YR', 1980)
);

Map.addLayer(iucn_pre1980, {color: 'white'}, 'PAs in 1980');
// Explore the countries dataset
print('Countries dataset:', table2.first());
Map.addLayer(table2, {color: 'orange'}, 'Countries');
// Filter the countries dataset to New Zealand
var nz = table2.filter(
  ee.Filter.eq('country_na', 'New Zealand')
);

print('New Zealand:', nz);
Map.addLayer(nz, {color: 'red'}, 'New Zealand');
// Filter protected areas to New Zealand
var nz_pas = table.filter(
  ee.Filter.bounds(nz)
);

// Count protected areas in New Zealand
print('Number of PAs in NZ:', nz_pas.size());

// Display the results
Map.addLayer(nz_pas, {color: 'yellow'}, 'NZ PAs only');

// SECTION 3.4 — CHAINING FILTERS
// National Parks (IUCN II) within New Zealand
var nz_national_parks = table
  .filter(ee.Filter.eq('IUCN_CAT', 'II'))
  .filter(ee.Filter.bounds(nz));

print('Number of National Parks in NZ:', nz_national_parks.size());


// SECTION 3.5 — COMPUTATIONS ON IMAGES

// 3.5.2: Correct a hypothetical elevation error (+100 m)
print('Original SRTM:', image);

var srtm_fixed = image.add(100);
Map.addLayer(srtm_fixed, elevationVis, 'SRTM +100m', false);


// 3.5.3: Find elevations greater than 1500 m
var elevGt1500_raw = image.gt(1500);
Map.addLayer(elevGt1500_raw, {}, 'Elevation >1500m binary', false);

// Mask zero values so only elevations >1500 m remain
var elevGt1500 = image.gt(1500).selfMask();

Map.addLayer(
  elevGt1500,
  {palette: ['fuchsia']},
  'Elevation >1500m',
  true,
  0.7
);


// 3.5.4: Calculate slope and hillshade
var terrain = ee.Terrain.products(image);
print('Terrain products:', terrain);

var slope = terrain.select('slope');
var hillshade = terrain.select('hillshade');

Map.addLayer(hillshade, {}, 'Hillshade', false);
Map.addLayer(
  slope,
  {palette: ['white', 'darkred', 'black'], min: 0, max: 45},
  'Slope',
  false
);

// SECTION 3.6 — REGION REDUCERS

// Find Egmont National Park (Mount Taranaki)
var taranaki = table.filter(
  ee.Filter.eq('NAME', 'Egmont National Park')
);

Map.addLayer(taranaki, {color: 'orange'}, 'Mt Taranaki NP', false);


// 1. Calculate average slope within the park
var slopeOutput = slope.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: taranaki.geometry(),
  scale: 90
});

print('Mean slope:', slopeOutput);


// 2. Compare with a clipped slope raster
var taranakiSlope = slope.clip(taranaki);

Map.addLayer(
  taranakiSlope,
  {palette: ['white', 'darkred', 'black'], min: 0, max: 45},
  'Taranaki slope',
  false
);

var slopeOutput2 = taranakiSlope.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: taranaki.geometry(),
  scale: 90
});

print('Mean slope (clipped):', slopeOutput2);


// 3. Maximum elevation
var elevOutput_Max = image.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: taranaki.geometry(),
  scale: 90
});

print('Maximum elevation:', elevOutput_Max);


// 4. Minimum elevation
var elevOutput_Min = image.reduceRegion({
  reducer: ee.Reducer.min(),
  geometry: taranaki.geometry(),
  scale: 90
});

print('Minimum elevation:', elevOutput_Min);


// 5. Calculate minimum and maximum together
var elevOutput_MinMax = image.reduceRegion({
  reducer: ee.Reducer.minMax(),
  geometry: taranaki.geometry(),
  scale: 90
});

print('Minimum and maximum elevation:', elevOutput_MinMax);


// 6. Calculate area above 1500 m
var areaGt1500m = elevGt1500
  .multiply(ee.Image.pixelArea())
  .reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: taranaki.geometry(),
    scale: 90
  });

print('Area above 1500m (m2):', areaGt1500m);

print(
  'Area above 1500m (km2):',
  ee.Number(areaGt1500m.get('elevation')).divide(1000000)
);

// SECTION 3.7 — IMAGE REDUCERS

// PART A: WORLDCLIM MONTHLY TEMPERATURE

var climate = ee.ImageCollection('WORLDCLIM/V1/MONTHLY');
print('WORLDCLIM collection:', climate);

// January and July average temperatures
var jan_climate = ee.Image('WORLDCLIM/V1/MONTHLY/01');
var july_climate = ee.Image('WORLDCLIM/V1/MONTHLY/07');

// Convert stored values to degrees Celsius
var jan_climate_avg = jan_climate.select('tavg').multiply(0.1);
var july_climate_avg = july_climate.select('tavg').multiply(0.1);

var meanTemperatureVis = {
  min: -40,
  max: 30,
  palette: ['blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

Map.addLayer(jan_climate_avg, meanTemperatureVis, 'January temperature', false);
Map.addLayer(july_climate_avg, meanTemperatureVis, 'July temperature', false);

// Calculate annual mean temperature
var annualMeanTemperature = climate
  .select('tavg')
  .mean()
  .multiply(0.1);

Map.addLayer(
  annualMeanTemperature,
  meanTemperatureVis,
  'Mean Annual Temperature',
  false
);


// PART B: LANDSAT SATELLITE IMAGE COMPOSITE

// Landsat 8 imagery from 2017
var landsat2017 = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
  .filterDate('2017-01-01', '2017-12-31');

var trueColour = landsat2017.select(['B4', 'B3', 'B2']);

var trueColourVis = {
  min: 0.0,
  max: 0.4
};

print('Landsat collection:', trueColour);

// Display a mosaic of the original imagery
Map.addLayer(
  trueColour.mosaic(),
  trueColourVis,
  'Landsat Original Mosaic',
  false
);

// Calculate median pixel values across all images
var LandsatMedian = trueColour.median();

Map.addLayer(
  LandsatMedian,
  trueColourVis,
  'Landsat Median Composite',
  true
);

// View Townsville
Map.setCenter(146.746, -19.529, 9);