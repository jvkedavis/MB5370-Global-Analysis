// MB5370 - Module 05
// Workshop 3 - Reviewing Results

// Instructor-provided nighttime light results
var nl_result = ee.FeatureCollection(
  'users/murrnick/mb5370/nl_change_per_5deg_grid'
);

// Inspect the first feature
print('Nighttime light results:', nl_result.first());

// Sort from highest to lowest mean change
var sorted_results = nl_result.sort('mean', false);

print('Highest nighttime light change:',
      sorted_results.first());

// Display grid boundaries
Map.addLayer(
  nl_result,
  {color: 'yellow'},
  'Nighttime Light Grid',
  false
);

// Visualise results using the mean attribute
var empty = ee.Image().float();
var palette = ['green', 'yellow', 'orange', 'red'];

var nlChangeMap = empty.paint({
  featureCollection: nl_result,
  color: 'mean'
});

Map.addLayer(
  nlChangeMap.updateMask(nlChangeMap.mask()),
  {min: -2, max: 9, palette: palette},
  'Nighttime Light Change'
);

// Global view
Map.setCenter(0, 0, 2);