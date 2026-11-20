// MB5370 - Module 05: Global Scale Analysis
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