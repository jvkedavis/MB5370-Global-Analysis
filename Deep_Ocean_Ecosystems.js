
// ======================================================
// MB5370 - Module 4
// Workshop 2 — MAPPING THE WORLD'S DEEP-OCEAN ECOSYSTEMS
// Midnight Ocean Atlas
// ======================================================


// ------------------------------------------------------
// PART 1 — BATHYMETRY DATA
// ------------------------------------------------------

// Import NOAA ETOPO1 global bathymetry
var etopo = ee.Image('NOAA/NGDC/ETOPO1');
var bedrock = etopo.select('bedrock');

// Convert negative elevations into positive ocean depths
var depth = bedrock.multiply(-1);
var oceanDepth = depth.updateMask(depth.gt(0));


// ------------------------------------------------------
// PART 2 — ECOSYSTEM CLASSIFICATION
// ------------------------------------------------------

// Hadal trenches and troughs: deeper than 6000 m
var hadal = oceanDepth.gt(6000).selfMask();

// Abyssal plains: 3000–6000 m
var abyssal = oceanDepth.gte(3000)
  .and(oceanDepth.lte(6000))
  .selfMask();

// Continental and island slopes: 250–3000 m
var continental = oceanDepth.gte(250)
  .and(oceanDepth.lt(3000))
  .selfMask();

// Potential submarine canyons:
// deeper than 200 m and slope >6 degrees
var terrain = ee.Terrain.products(bedrock);
var oceanSlope = terrain.select('slope');

var canyons = oceanDepth.gt(200)
  .and(oceanSlope.gt(6))
  .selfMask();


// ------------------------------------------------------
// PART 3 — ECOSYSTEM COLOUR PALETTE
// ------------------------------------------------------

var COLORS = {
  continental: '#55C5C1',
  abyssal: '#2860A4',
  hadal: '#7460BC',
  canyons: '#F2A65A',
  panel: '#102437',
  border: '#49647A',
  heading: '#F0F7FF',
  body: '#D1E2EF',
  muted: '#9CB5C8'
};


// ------------------------------------------------------
// PART 4 — MIDNIGHT OCEAN BASEMAP
// ------------------------------------------------------

var darkOceanStyle = [
  {
    elementType: 'geometry',
    stylers: [{color: '#152B3C'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#071525'}]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{color: '#263C46'}]
  },
  {
    featureType: 'road',
    stylers: [{visibility: 'off'}]
  },
  {
    featureType: 'poi',
    stylers: [{visibility: 'off'}]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{color: '#B5C8D6'}]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{color: '#152B3C'}]
  }
];

Map.setOptions('Midnight Ocean', {
  'Midnight Ocean': darkOceanStyle
});


// ------------------------------------------------------
// PART 5 — DISPLAY ECOSYSTEMS
// ------------------------------------------------------

Map.addLayer(
  continental,
  {palette: [COLORS.continental]},
  'Continental and Island Slopes',
  true,
  0.95
);

Map.addLayer(
  abyssal,
  {palette: [COLORS.abyssal]},
  'Abyssal Plains',
  true,
  0.95
);

Map.addLayer(
  hadal,
  {palette: [COLORS.hadal]},
  'Hadal Trenches and Troughs',
  true,
  1
);

Map.addLayer(
  canyons,
  {palette: [COLORS.canyons]},
  'Potential Submarine Canyons',
  true,
  1
);

// Global starting view
Map.setCenter(0, 0, 2);


// ------------------------------------------------------
// PART 6 — MARINE PROTECTED AREAS
// ------------------------------------------------------

// Import WDPA vector polygons
var protectedAreas = ee.FeatureCollection(
  'WCMC/WDPA/current/polygons'
);

// Select areas classified as marine
var marineProtectedAreas = protectedAreas.filter(
  ee.Filter.eq('REALM', 'Marine')
);

// Display as optional white outlines
Map.addLayer(
  marineProtectedAreas.style({
    color: '#DDEAF4',
    fillColor: '00000000',
    width: 1
  }),
  {},
  'Marine Protected Areas',
  false
);


// ------------------------------------------------------
// PART 7 — MAP TITLE AND INFORMATION PANEL
// ------------------------------------------------------

// Dark information panel
var infoPanel = ui.Panel({
  style: {
    position: 'top-left',
    width: '320px',
    padding: '14px',
    backgroundColor: COLORS.panel,
    border: '1px solid ' + COLORS.border
  }
});

// Small heading
infoPanel.add(ui.Label({
  value: 'GLOBAL MARINE ECOSYSTEM ATLAS',
  style: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: COLORS.continental,
    backgroundColor: COLORS.panel,
    margin: '0 0 8px 0'
  }
}));

// Main title
infoPanel.add(ui.Label({
  value: "Mapping the World's Deep-Ocean Ecosystems",
  style: {
    fontSize: '19px',
    fontWeight: 'bold',
    color: COLORS.heading,
    backgroundColor: COLORS.panel,
    margin: '0 0 10px 0'
  }
}));

// Description
infoPanel.add(ui.Label({
  value: 'Explore the global distribution of deep-seafloor habitats classified using bathymetry and terrain slope.',
  style: {
    fontSize: '12px',
    color: COLORS.body,
    backgroundColor: COLORS.panel,
    margin: '0 0 10px 0'
  }
}));

// Data sources
infoPanel.add(ui.Label({
  value: 'DATA SOURCES',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: COLORS.continental,
    backgroundColor: COLORS.panel,
    margin: '0 0 4px 0'
  }
}));

infoPanel.add(ui.Label({
value: 'NOAA ETOPO1 Global Relief Model\nWorld Database on Protected Areas (WDPA)\nInterRidge Global Hydrothermal Vent Database (2020)',  style: {
    fontSize: '11px',
    color: COLORS.muted,
    backgroundColor: COLORS.panel,
    margin: '0 0 10px 0',
    whiteSpace: 'pre-wrap'
  }
}));

// Vector dataset explanation
infoPanel.add(ui.Label({
  value: 'Marine protected areas provide conservation context, allowing comparison of ecosystem distributions with designated protected areas.',
  style: {
    fontSize: '11px',
    color: COLORS.body,
    backgroundColor: COLORS.panel,
    margin: '0 0 8px 0'
  }
}));

// Disclaimer
infoPanel.add(ui.Label({
  value: 'Canyon classification is based on depth and slope thresholds and does not represent a verified canyon inventory.',
  style: {
    fontSize: '10px',
    color: COLORS.muted,
    backgroundColor: COLORS.panel,
    margin: '0'
  }
}));

Map.add(infoPanel);


// ------------------------------------------------------
// PART 8 — DARK ECOSYSTEM LEGEND
// ------------------------------------------------------


// ------------------------------------------------------
// PART 8 — DARK ECOSYSTEM LEGEND
// ------------------------------------------------------

// Create legend panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    width: '290px',
    padding: '14px',
    backgroundColor: COLORS.panel,
    border: '1px solid ' + COLORS.border
  }
});

// Legend heading
legend.add(ui.Label({
  value: 'ECOSYSTEM CLASSIFICATION',
  style: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: COLORS.heading,
    backgroundColor: COLORS.panel,
    margin: '0 0 12px 0'
  }
}));

// Function for ecosystem legend entries
function addLegendRow(color, label) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 10px 6px 0'
    }
  });

  var description = ui.Label({
    value: label,
    style: {
      color: COLORS.body,
      backgroundColor: COLORS.panel,
      fontSize: '11px',
      margin: '0 0 6px 0'
    }
  });

  legend.add(ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal'),
    style: {
      backgroundColor: COLORS.panel,
      margin: '0',
      padding: '0'
    }
  }));
}

// Four ecosystem classifications
addLegendRow(
  COLORS.continental,
  'Continental/island slopes (250-3000 m)'
);

addLegendRow(
  COLORS.abyssal,
  'Abyssal plains (3000-6000 m)'
);

addLegendRow(
  COLORS.hadal,
  'Hadal trenches (>6000 m)'
);

addLegendRow(
  COLORS.canyons,
  'Potential submarine canyons (>200 m, >6°)'
);


// ------------------------------------------------------
// ADDITIONAL MARINE FEATURES
// ------------------------------------------------------

legend.add(ui.Label({
  value: 'ADDITIONAL MARINE FEATURES',
  style: {
    fontSize: '10px',
    fontWeight: 'bold',
    color: COLORS.continental,
    backgroundColor: COLORS.panel,
    margin: '12px 0 8px 0'
  }
}));

// Marine protected areas: unfilled white square
var mpaSymbol = ui.Label({
  value: '□',
  style: {
    color: '#DDEAF4',
    fontSize: '20px',
    fontWeight: 'bold',
    backgroundColor: COLORS.panel,
    width: '22px',
    margin: '0 6px 4px 0'
  }
});

var mpaText = ui.Label({
  value: 'Marine protected areas',
  style: {
    color: COLORS.body,
    fontSize: '11px',
    backgroundColor: COLORS.panel,
    margin: '4px 0 4px 0'
  }
});

legend.add(ui.Panel({
  widgets: [mpaSymbol, mpaText],
  layout: ui.Panel.Layout.Flow('horizontal'),
  style: {
    backgroundColor: COLORS.panel,
    margin: '0',
    padding: '0'
  }
}));

// Hydrothermal vent fields: pink circle
var ventSymbol = ui.Label({
  value: '●',
  style: {
    color: '#FF6B9A',
    fontSize: '17px',
    backgroundColor: COLORS.panel,
    width: '22px',
    margin: '0 6px 4px 0'
  }
});

var ventText = ui.Label({
  value: 'Hydrothermal vent fields',
  style: {
    color: COLORS.body,
    fontSize: '11px',
    backgroundColor: COLORS.panel,
    margin: '2px 0 4px 0'
  }
});

legend.add(ui.Panel({
  widgets: [ventSymbol, ventText],
  layout: ui.Panel.Layout.Flow('horizontal'),
  style: {
    backgroundColor: COLORS.panel,
    margin: '0',
    padding: '0'
  }
}));

// Instructions for optional layers
legend.add(ui.Label({
  value: 'Enable optional layers in the Layers menu.',
  style: {
    fontSize: '10px',
    color: COLORS.muted,
    backgroundColor: COLORS.panel,
    margin: '8px 0 0 0'
  }
}));

// Display legend on map
Map.add(legend);



// ------------------------------------------------------
// PART 9 — CONSOLE OUTPUTS
// ------------------------------------------------------

print('ETOPO1 bathymetry:', bedrock);
print('Ocean depth:', oceanDepth);
print('Seafloor slope:', oceanSlope);
print('Marine protected areas:', marineProtectedAreas.size());


// PART 10 — EXTERNALLY UPLOADED HYDROTHERMAL VENTS

// Import hydrothermal vents from my Earth Engine Assets
var hydrothermalVents = ee.FeatureCollection(
  'projects/mb5370-global-analysis/assets/Global_Hydrothermal_Vents'
);

// Style the vent locations as bright pink points
var ventStyle = hydrothermalVents.style({
  color: '#FF6B9A',
  pointSize: 4,
  pointShape: 'circle',
  width: 1
});

// Add as an optional layer
Map.addLayer(
  ventStyle,
  {},
  'Hydrothermal Vent Fields',
  false
);

// Check the imported dataset
print('Hydrothermal vent fields:', hydrothermalVents.size());
print('Example vent field:', hydrothermalVents.first());

// ======================================================
// END OF SCRIPT
// ======================================================