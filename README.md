# MB5370 — Global Scale Analysis

This repository contains my Google Earth Engine (GEE) scripts for the Global Scale Analysis module in MB5370 at James Cook University. Across the workshops, I worked through the basics of JavaScript and Earth Engine before applying spatial analysis to global environmental datasets.

The exercises cover everything from filtering protected areas and analysing terrain to mapping changes in population and nighttime lights. I also used the Allen Coral Atlas to compare mapped coral/algae habitat around island research stations. Alongside the workshop exercises, I developed a global map of deep-ocean ecosystems, which gave me a chance to bring the analysis and visualisation techniques together in a marine context.

## Repository contents

| Script | What it covers |
| --- | --- |
| [Workshop1_Introduction.js](Workshop1_Introduction.js) | JavaScript fundamentals, arrays, objects, functions, and introductory Earth Engine operations. |
| [Workshop1_Visualisation.js](Workshop1_Visualisation.js) | Map configuration and visualisation of elevation and protected areas around Mount Taranaki, New Zealand. |
| [Workshop2_Filters_Computation.js](Workshop2_Filters_Computation.js) | Filtering protected areas, elevation and slope analysis, regional reducers, WorldClim temperatures, and Landsat image composites. |
| [Workshop3_Nightlights_Coastlines.js](Workshop3_Nightlights_Coastlines.js) | Comparing population and nighttime-light datasets across global coastal grid cells, with code for exporting the results. |
| [Workshop3_Results.js](Workshop3_Results.js) | Exploring and mapping instructor-provided results for changes in nighttime lights. |
| [Workshop4_Allen_Coral_Atlas.js](Workshop4_Allen_Coral_Atlas.js) | Estimating and ranking mapped coral/algae habitat within 800 m of ten island research stations. |
| [Deep_Ocean_Ecosystems.js](Deep_Ocean_Ecosystems.js) | *Midnight Ocean Atlas*: a global map of deep-ocean environments, marine protected areas, and hydrothermal vent fields. |

## Workshop 4 — Allen Coral Atlas

For this exercise, I asked which of ten island research stations had the greatest mapped area of coral/algae habitat within 800 m of the station. I used the Allen Coral Atlas benthic classification, selected the combined coral/algae category (class 15), buffered each station by 800 m, and calculated habitat area using pixel area and a regional sum at 5 m scale. The results were ranked and exported as a CSV.

An important limitation is that **coral/algae is a combined mapped habitat class**, so the results should not be interpreted as measurements of live coral cover. Some station coordinates are approximate, and an 800 m circular buffer is a spatial comparison rather than a measure of safe or practical snorkelling access.

## Midnight Ocean Atlas

I was particularly interested in applying the mapping tools to marine environments, so I developed *Midnight Ocean Atlas* to explore how different deep-seafloor settings are distributed globally.

The map uses NOAA ETOPO1 bathymetry and terrain slope to distinguish:

- Continental and island slopes (250–3,000 m)
- Abyssal plains (3,000–6,000 m)
- Hadal trenches and troughs (deeper than 6,000 m)
- Potential submarine canyons (deeper than 200 m, with slope greater than 6°)

I also included optional marine protected area outlines from the World Database on Protected Areas (WDPA) and hydrothermal vent field locations from an externally uploaded dataset based on the InterRidge Global Hydrothermal Vent Database. A custom dark basemap, information panel, and legend make the different layers easier to explore.

These are **broad classifications based on depth and slope thresholds**, not a validated global inventory of seafloor ecosystems. In particular, the potential submarine canyon layer identifies terrain meeting a simple set of criteria rather than confirmed canyons.

## Running the scripts

The scripts were written for the **Google Earth Engine Code Editor** at [code.earthengine.google.com](https://code.earthengine.google.com/), rather than for standalone JavaScript execution.

Some scripts use imported objects or datasets configured in the Earth Engine editor and **not included as files in this repository**:

- **Workshop 1 / Workshop 2:** the imported elevation image (`image`), protected area collection (`table`), and country boundaries (`table2`).
- **Workshop 3:** teaching datasets referenced by their Earth Engine asset paths, including the global grid, coastline, and instructor-provided results. Access depends on these datasets remaining available and shared.
- **Workshop 4:** the Allen Coral Atlas image imported in the editor as `aca` (using its `benthic` band).
- **Midnight Ocean Atlas:** the hydrothermal vent FeatureCollection stored at `projects/mb5370-global-analysis/assets/Global_Hydrothermal_Vents`. The script references this asset, but the underlying uploaded dataset is not reproduced here.

The scripts document my workshop analysis and mapping process. Reproducing individual maps or exports may require setting up these imports and permissions in Earth Engine.

## About this work

This repository is part of my postgraduate marine biology coursework at James Cook University. It reflects my developing use of Earth Engine for spatial analysis, environmental data interpretation, and marine mapping.
