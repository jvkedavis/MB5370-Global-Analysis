// MB5370 - Module 04
// Workshop 4 - Allen Coral Atlas

// Research question:
// Which research station has the greatest area of
// coral/algae habitat within 800 m of the station?


// 5.2 - GLOBAL VARIABLES

// Maximum unsupported snorkelling distance
var distance = 800; // metres


// 5.3 - RESEARCH STATION LOCATIONS

// Satellite basemap
Map.setOptions('SATELLITE');

// Centre map on Heron Island
Map.setCenter(148.95757924, -20.34639327, 17);

// ------------------------------------------------------
// 5.3 — RESEARCH STATION LOCATIONS
// ------------------------------------------------------

// Heron Island
var HeronIsland = ee.Feature(
  ee.Geometry.Point([151.91400746, -23.44100605]),
  {Station: 'Heron Island'}
);

// Hamilton Island
var HamiltonIsland = ee.Feature(
  ee.Geometry.Point([148.95757924, -20.34639327]),
  {Station: 'Hamilton Island'}
);

// Lizard Island
var LizardIsland = ee.Feature(
  ee.Geometry.Point([145.44647541, -14.66767257]),
  {Station: 'Lizard Island'}
);

// Daydream Island
var DaydreamIsland = ee.Feature(
  ee.Geometry.Point([148.81555647, -20.25161732]),
  {Station: 'Daydream Island'}
);

// Orpheus Island
var OrpheusIsland = ee.Feature(
  ee.Geometry.Point([146.49992691, -18.63411616]),
  {Station: 'Orpheus Island'}
);


// Fitzroy Island
var FitzroyIsland = ee.Feature(
  ee.Geometry.Point([145.9947, -16.9327]),
  {Station: 'Fitzroy Island'}
);


// Lord Howe Island
var LordHoweIsland = ee.Feature(
  ee.Geometry.Point([159.0675, -31.5261]),
  {Station: 'Lord Howe Island'}
);


// Lady Elliot Island
var LadyElliotIsland = ee.Feature(
  ee.Geometry.Point([152.714, -24.113]),
  {Station: 'Lady Elliot Island'}
);

// One Tree Island
var OneTreeIsland = ee.Feature(
  ee.Geometry.Point([152.09203, -23.50872]),
  {Station: 'One Tree Island'}
);

// Low Isles
var LowIsles = ee.Feature(
  ee.Geometry.Point([145.5599, -16.3840]),
  {Station: 'Low Isles'}
);


// Combine all 10 research sites
var field_stations = ee.FeatureCollection([
  HeronIsland,
  HamiltonIsland,
  LizardIsland,
  DaydreamIsland,
  OrpheusIsland,
  FitzroyIsland,
  LordHoweIsland,
  LadyElliotIsland,
  OneTreeIsland,
  LowIsles
]);


// Inspect the stations
print('Research stations:', field_stations);
print('Number of stations:', field_stations.size());

// Display station locations
Map.addLayer(
  field_stations,
  {color: 'red'},
  'Research Stations'
);

// Show all five stations
Map.centerObject(field_stations, 5);

// ------------------------------------------------------
// 5.4 - ALLEN CORAL ATLAS DATA
// ------------------------------------------------------

// Inspect the dataset
print('Allen Coral Atlas:', aca);

// Check the available bands
print('ACA band names:', aca.bandNames());

// Display the ACA data
Map.addLayer(
  aca,
  {},
  'Allen Coral Atlas',
  false
);

// ------------------------------------------------------
// 5.5.1 - SELECT CORAL/ALGAE HABITAT
// ------------------------------------------------------

// Select the benthic classification band
var benthic = aca.select('benthic');

// Create a binary image: 1 = coral/algae, 0 = other
var coral = benthic.eq(15);

// Mask non-coral/algae pixels
coral = coral.selfMask();

// Display coral/algae habitat
Map.addLayer(
  coral,
  {palette: ['#FF6B6B']},
  'Coral/Algae Habitat'
);

// ------------------------------------------------------
// 5.5.2 - BUFFERING RESEARCH STATIONS
// ------------------------------------------------------

// Select the first research station
var firstStation = ee.Feature(field_stations.first());

// Create an 800 m buffer
var buffered = firstStation.buffer(distance);

// Display the buffer
Map.addLayer(
  buffered,
  {color: 'yellow'},
  'First Station - 800 m Buffer'
);

// Inspect the result
print('First buffered station:', buffered);

// Zoom to the first station
Map.centerObject(buffered, 14);

// ------------------------------------------------------
// 5.5.3 - BUFFER ALL RESEARCH STATIONS
// ------------------------------------------------------

// Define a function to buffer each station
var bufferer = function(feature) {
  var bufferedStation = feature.buffer(distance);
  return bufferedStation;
};

// Apply the function to all 10 stations
var bufferedStations = field_stations.map(bufferer);

// Inspect the resulting FeatureCollection
print('Buffered research stations:', bufferedStations);
print('Number of buffered stations:', bufferedStations.size());

// Display all station buffers
Map.addLayer(
  bufferedStations,
  {color: 'yellow'},
  'All Station Buffers'
);

// Zoom out to show the station distribution
Map.centerObject(bufferedStations, 5);


// ------------------------------------------------------
// 5.5.4 - CALCULATE CORAL/ALGAE AREA
// ------------------------------------------------------

// Convert coral/algae pixels to area in square metres
var coral_area = coral
  .multiply(ee.Image.pixelArea())
  .reduceRegions({
    collection: bufferedStations,
    reducer: ee.Reducer.sum(),
    scale: 5
  });

// Inspect results
print('Coral/algae area by station:', coral_area);

// Inspect the first station
print('First station coral/algae area:', coral_area.first());


// ------------------------------------------------------
// 5.5.5 - RANK RESEARCH STATIONS
// ------------------------------------------------------

// Sort stations by coral/algae area, highest first
var rankedStations = coral_area.sort('sum', false);

// Display the ranking
print('Ranked research stations:', rankedStations);

// Identify the station with the most coral/algae habitat
print('Best research station:', rankedStations.first());

// Create a table with area in square metres and hectares
var resultsTable = rankedStations.map(function(feature) {
  var area = feature.get('sum');

  return ee.Feature(null, {
    Station: feature.get('Station'),
    Coral_Area_m2: area,
    Coral_Area_ha: ee.Algorithms.If(
      ee.Algorithms.IsEqual(area, null),
      null,
      ee.Number(area).divide(10000)
    )
  });
});

// Inspect the results
print('Research station ranking table:', resultsTable);

// ------------------------------------------------------
// 5.6 - EXPORT RESEARCH STATION RESULTS
// ------------------------------------------------------

// Export ranked coral/algae habitat results to Google Drive
Export.table.toDrive({
  collection: resultsTable,
  description: 'Workshop4_Coral_Station_Ranking',
  fileNamePrefix: 'MB5370_Coral_Station_Ranking',
  fileFormat: 'CSV',
  selectors: ['Station', 'Coral_Area_m2', 'Coral_Area_ha']
});